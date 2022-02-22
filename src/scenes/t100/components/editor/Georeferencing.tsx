import { BasicTileLayer } from '../../../../services/geoTools/tileLayers';
import { Card, Divider, Dropdown, DropdownProps, Grid, Image, Label, List, Radio, Segment } from 'semantic-ui-react';
import { IToolInstance } from '../../../types';
import { Icon } from 'leaflet';
import { ImageOverlay, Map, Marker } from 'react-leaflet';
import { ModflowModel } from '../../../../core/model/modflow';
import { SyntheticEvent, useRef, useState } from 'react';
import { cloneDeep } from 'lodash';
import { gameBoards } from '../../assets/images';
import { renderAreaLayer } from '../../../t03/components/maps/mapLayers';
import Scenario from '../../../../core/marPro/Scenario';
import SliderWithTooltip from '../../../shared/complexTools/SliderWithTooltip';
import marker from '../../assets/marker.png';

interface IProps {
  onChange: (scenario: Scenario) => any;
  onChangeModel: (id: string) => any;
  model?: ModflowModel;
  scenario: Scenario;
  t03Instances: IToolInstance[];
}

const Georeferencing = (props: IProps) => {
  const [opacity, setOpacity] = useState<number>(0.5);

  const imageRef = useRef<any>();
  const marker1Ref = useRef<any>();
  const marker2Ref = useRef<any>();

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
    props.onChangeModel(value);
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
    scenario.referencePoints = newPoints;
    props.onChange(Scenario.fromObject(scenario));
  };

  const renderMap = () => {
    if (!props.model) {
      return null;
    }

    return (
      <Segment>
        <Map style={{ height: '500px', width: '100%' }} bounds={props.model.boundingBox.getBoundsLatLng()}>
          <BasicTileLayer />
          {renderAreaLayer(props.model.geometry)}
          <ImageOverlay
            bounds={props.scenario.referencePoints}
            opacity={opacity}
            ref={imageRef}
            url={gameBoards[0].img}
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
            <Dropdown
              options={props.t03Instances.map((i, key) => {
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
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Georeferencing;
