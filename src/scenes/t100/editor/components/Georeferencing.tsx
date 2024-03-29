import { BasicTileLayer } from '../../../../services/geoTools/tileLayers';
import {
  Card,
  Divider,
  Dropdown,
  DropdownProps,
  Form,
  Grid,
  Header,
  Image,
  Label,
  List,
  Radio,
  Segment,
} from 'semantic-ui-react';
import { IGameBoard, gameBoards } from '../../assets/images';
import { IRootReducer } from '../../../../reducers';
import { IToolInstance } from '../../../types';
import { Icon } from 'leaflet';
import { ImageOverlay, Map, Marker } from 'react-leaflet';
import { ModflowModel } from '../../../../core/model/modflow';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { cloneDeep, uniqBy } from 'lodash';
import { fetchApiWithToken, fetchUrl } from '../../../../services/api';
import { renderAreaLayer } from '../../../t03/components/maps/mapLayers';
import { updateModel, updateT03Instances } from '../actions/actions';
import { useDispatch, useSelector } from 'react-redux';
import Scenario from '../../../../core/marPro/Scenario';
import SliderWithTooltip from '../../../shared/complexTools/SliderWithTooltip';
import marker from '../../assets/marker.png';

interface IProps {
  onChange: (scenario: Scenario) => any;
  onChangeModel: (id: string) => any;
  scenario: Scenario;
}

const Georeferencing = (props: IProps) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [opacity, setOpacity] = useState<number>(0.5);

  const imageRef = useRef<any>();
  const marker1Ref = useRef<any>();
  const marker2Ref = useRef<any>();

  const dispatch = useDispatch();

  const MarPro = useSelector((state: IRootReducer) => state.MarProEditorReducer);
  const model = MarPro.model ? ModflowModel.fromObject(MarPro.model) : null;
  const t03Instances = MarPro.t03instances;

  useEffect(() => {
    const fetchInstances = async () => {
      try {
        setIsFetching(true);
        const privateT03Tools = (await fetchApiWithToken('tools/T03?public=false')).data;
        const publicT03Tools = (await fetchApiWithToken('tools/T03?public=true')).data;

        const tools = uniqBy(privateT03Tools.concat(publicT03Tools), (t: IToolInstance) => t.id);
        dispatch(updateT03Instances(tools));
      } catch (err) {
        console.log(err);
      } finally {
        setIsFetching(false);
      }
    };

    if (MarPro.t03instances && MarPro.t03instances.length === 0) {
      fetchInstances();
    }
  }, [dispatch, MarPro.t03instances]);

  const handleChangeImage = (value: IGameBoard) => () => {
    const scenario = props.scenario.toObject();
    scenario.data.backgroundImage = value.img;
    scenario.data.stageSize = value.size;

    props.onChange(Scenario.fromObject(scenario));
  };

  const handleChangeModel = (_: SyntheticEvent, { value }: DropdownProps) => {
    if (typeof value !== 'string') {
      return null;
    }

    setIsFetching(true);
    fetchUrl(
      `modflowmodels/${value}`,
      (data) => {
        const mfModel = ModflowModel.fromQuery(data);
        dispatch(updateModel(mfModel));

        const cScenario = props.scenario.toObject();
        cScenario.data.modelId = value;
        cScenario.data.referencePoints = mfModel.boundingBox.getBoundsLatLng();
        props.onChange(Scenario.fromObject(cScenario));
        props.onChangeModel(value);

        setIsFetching(false);
      },
      () => {
        console.log('Fetching model failed.');
        setIsFetching(false);
      }
    );
  };

  const handleChangeOpacity = (value: number) => setOpacity(value);

  const handleDragMarker = (key: number) => (e: any) => {
    const points = props.scenario.referencePoints;
    points[key] = [e.latlng.lat, e.latlng.lng];
    imageRef.current.leafletElement.setBounds(points);
  };

  const handleDragEndMarker = (key: number) => () => {
    const marker = key === 0 ? marker1Ref.current : marker2Ref.current;
    const coords = marker.leafletElement.getLatLng();
    const newPoints = cloneDeep(props.scenario.referencePoints);
    newPoints[key] = [coords.lat, coords.lng];
    const scenario = props.scenario.toObject();
    scenario.data.referencePoints = newPoints;
    props.onChange(Scenario.fromObject(scenario));
  };

  const renderMap = () => {
    if (!model) {
      return null;
    }

    return (
      <Segment>
        <Map style={{ height: '500px', width: '100%' }} bounds={model.boundingBox.getBoundsLatLng()}>
          <BasicTileLayer />
          {renderAreaLayer(model.geometry)}
          <ImageOverlay
            bounds={props.scenario.referencePoints}
            opacity={opacity}
            ref={imageRef}
            url={props.scenario.image}
          />
          <Marker
            draggable
            icon={new Icon({ iconUrl: marker, iconSize: [50, 50], iconAnchor: [25, 50] })}
            ondrag={handleDragMarker(0)}
            ondragend={handleDragEndMarker(0)}
            ref={marker1Ref}
            position={props.scenario.referencePoints[0]}
          />
          <Marker
            draggable
            icon={new Icon({ iconUrl: marker, iconSize: [50, 50], iconAnchor: [25, 50] })}
            ondrag={handleDragMarker(1)}
            ondragend={handleDragEndMarker(1)}
            ref={marker2Ref}
            position={props.scenario.referencePoints[1]}
          />
        </Map>
      </Segment>
    );
  };

  return (
    <Segment color="grey">
      <Header as="h3">Select background and connect to model</Header>
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <Card.Group>
              {gameBoards.map((gb, k) => (
                <Card key={k}>
                  <Image src={gb.img} wrapped ui={false} />
                  <Card.Content>
                    <Card.Header>{gb.name}</Card.Header>
                    <Card.Meta>{gb.country}</Card.Meta>
                    <Card.Description>{gb.description}</Card.Description>
                  </Card.Content>
                  <Card.Content textAlign="center">
                    <Radio checked={props.scenario.image === gb.img} onChange={handleChangeImage(gb)} />
                  </Card.Content>
                </Card>
              ))}
            </Card.Group>
          </Grid.Column>
        </Grid.Row>
        <Divider />
        {props.scenario.image && (
          <Grid.Row>
            <Grid.Column width={12}>
              <Form>
                <Form.Group>
                  <Form.Input
                    disabled
                    type="number"
                    label="Stage width"
                    name="stageSizeX"
                    value={props.scenario.stageSize.x}
                  />
                  <Form.Input
                    disabled
                    type="number"
                    label="Stage height"
                    name="stageSizeY"
                    value={props.scenario.stageSize.y}
                  />
                </Form.Group>
              </Form>
              <Divider />
              <Dropdown
                loading={isFetching}
                options={t03Instances.map((i, key) => {
                  return {
                    key,
                    value: i.id,
                    text: i.name,
                  };
                })}
                onChange={handleChangeModel}
                placeholder="Select modflow model ..."
                value={props.scenario.modelId}
                fluid
                search
                selection
              />
              {renderMap()}
            </Grid.Column>
            <Grid.Column width={4}>
              Opacity
              <SliderWithTooltip
                defaultValue={0.5}
                min={0}
                max={1}
                step={0.1}
                value={opacity}
                onChange={handleChangeOpacity}
              />
              <Divider />
              {props.scenario.referencePoints.length > 0 && (
                <List>
                  <List.Item>
                    <List.Header>Reference Points</List.Header>
                  </List.Item>
                  <List.Item>
                    Point 1
                    <List.List>
                      <List.Item>
                        Latitude
                        <Label style={{ textAlign: 'right', width: '100%' }}>
                          {props.scenario.referencePoints[0][0]}
                        </Label>
                      </List.Item>
                      <List.Item>
                        Longitude
                        <Label style={{ textAlign: 'right', width: '100%' }}>
                          {props.scenario.referencePoints[0][1]}
                        </Label>
                      </List.Item>
                    </List.List>
                  </List.Item>
                  <List.Item>
                    Point 2
                    <List.List>
                      <List.Item>
                        Latitude
                        <Label style={{ textAlign: 'right', width: '100%' }}>
                          {props.scenario.referencePoints[1][0]}
                        </Label>
                      </List.Item>
                      <List.Item>
                        Longitude
                        <Label style={{ textAlign: 'right', width: '100%' }}>
                          {props.scenario.referencePoints[1][1]}
                        </Label>
                      </List.Item>
                    </List.List>
                  </List.Item>
                </List>
              )}
            </Grid.Column>
          </Grid.Row>
        )}
      </Grid>
    </Segment>
  );
};

export default Georeferencing;
