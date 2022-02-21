import { BasicTileLayer } from '../../../../services/geoTools/tileLayers';
import { Card, Dropdown, DropdownProps, Grid, Image, Input, Loader, Radio, Segment } from 'semantic-ui-react';
import { IModflowModel } from '../../../../core/model/modflow/ModflowModel.type';
import { IToolInstance } from '../../../types';
import { Icon, LeafletEvent } from 'leaflet';
import { ImageOverlay, Map, Marker } from 'react-leaflet';
import { ModflowModel } from '../../../../core/model/modflow';
import { RefObject, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { fetchApiWithToken, fetchUrl } from '../../../../services/api';
import { gameBoards } from '../../assets/images';
import { renderAreaLayer } from '../../../t03/components/maps/mapLayers';
import { uniqBy } from 'lodash';
import Scenario from '../../../../core/marPro/Scenario';
import SliderWithTooltip from '../../../shared/complexTools/SliderWithTooltip';
import marker from '../../assets/marker.png';
import uuid from 'uuid';
import { CLONE_SOILMODEL_LAYER } from '../../../t03/reducers/soilmodel';

interface IProps {
  onChange: (scenario: Scenario) => any;
  scenario: Scenario;
}

const Georeferencing = (props: IProps) => {
  const [errors, setErrors] = useState<Array<{ id: string; message: string }>>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [opacity, setOpacity] = useState<number>(0.5);
  const [referencePoints, setReferencePoints] = useState<Array<[number, number]>>([]);
  const [selectedModel, setSelectedModel] = useState<IModflowModel>();
  const [t03Instances, setT03Instances] = useState<IToolInstance[]>();

  const ImageRef = useRef<any>();

  useEffect(() => {
    const fetchInstances = async () => {
      try {
        setIsFetching(true);
        const privateT03Instances = (await fetchApiWithToken('tools/T03?public=false')).data;
        const publicT03Instances = (await fetchApiWithToken('tools/T03?public=true')).data;

        const tools = uniqBy(privateT03Instances.concat(publicT03Instances), (t: IToolInstance) => t.id);
        setT03Instances(tools);
      } catch (err) {
        setErrors(errors.concat([{ id: uuid.v4(), message: 'Fetching t03 instances failed.' }]));
      } finally {
        setIsFetching(false);
      }
    };

    fetchInstances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchModel = (id: string) => {
    setIsFetching(true);
    fetchUrl(
      `modflowmodels/${id}`,
      (data) => {
        const mfModel = ModflowModel.fromQuery(data);

        setReferencePoints(mfModel.boundingBox.getBoundsLatLng());
        setSelectedModel(mfModel.toObject());
        setIsFetching(false);
      },
      () => {
        setErrors(errors.concat([{ id: uuid.v4(), message: 'Fetching model failed.' }]));
        setIsFetching(false);
      }
    );
  };

  const handleChangeImage = (value: string) => () => {
    const scenario = props.scenario.toObject();
    scenario.backgroundImage = value;
    props.onChange(Scenario.fromObject(scenario));
  };

  const handleChangeModel = (e: SyntheticEvent, { value }: DropdownProps) => {
    if (typeof value !== 'string') {
      return null;
    }
    const scenario = props.scenario.toObject();
    scenario.modelId = value;
    props.onChange(Scenario.fromObject(scenario));
    fetchModel(value);
  };

  const handleChangeOpacity = (value: number) => setOpacity(value);

  const handleDragMarker = (key: number) => (e: any) => {
    const points = referencePoints;
    points[key] = [e.latlng.lat, e.latlng.lng];
    ImageRef.current.leafletElement.setBounds(points);
  };

  const handleDragEndMarker = (key: number) => (e: any) => {
    console.log(e);
    const points = referencePoints;
    points[key] = [e.target._latlng.lat, e.target._latlng.lng];
    setReferencePoints(points);
  };

  console.log(referencePoints);

  const renderMap = () => {
    if (!selectedModel) {
      return null;
    }
    const model = ModflowModel.fromObject(selectedModel);

    return (
      <Segment>
        <Map style={{ height: '500px', width: '100%' }} bounds={model.boundingBox.getBoundsLatLng()}>
          <BasicTileLayer />
          {renderAreaLayer(model.geometry)}
          <ImageOverlay bounds={referencePoints} opacity={opacity} ref={ImageRef} url={gameBoards[0].img} />
          {referencePoints.map((point, k) => (
            <Marker
              draggable
              icon={new Icon({ iconUrl: marker, iconSize: [50, 50], iconAnchor: [25, 50] })}
              key={k}
              ondrag={handleDragMarker(k)}
              ondragend={handleDragEndMarker(k)}
              position={point}
            />
          ))}
        </Map>
      </Segment>
    );
  };

  return (
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
                  <Radio checked={props.scenario.image === gb.img} onChange={handleChangeImage(gb.img)} />
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={12}>
          <Segment>
            {!isFetching && t03Instances && (
              <Dropdown
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
            )}
            {isFetching && <Loader active={true} inline="centered" />}
            {renderMap()}
          </Segment>
        </Grid.Column>
        <Grid.Column width={4}>
          <Segment>
            Opacity
            <SliderWithTooltip
              defaultValue={0.5}
              min={0}
              max={1}
              step={0.1}
              value={opacity}
              onChange={handleChangeOpacity}
            />
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Georeferencing;
