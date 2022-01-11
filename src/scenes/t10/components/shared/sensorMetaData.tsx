import {
  Button,
  Dropdown,
  Form,
  Grid,
  Header,
  InputOnChangeData,
  Label,
  Modal,
  Segment,
  Table,
} from 'semantic-ui-react';
import { ChangeEvent, useState } from 'react';
import { ISensorParameter } from '../../../../core/model/rtm/monitoring/Sensor.type';
import { ParameterCollection } from '../../../../core/model/rtm/monitoring/ParameterCollection';
import { Point } from 'geojson';
import { Rtm, Sensor } from '../../../../core/model/rtm/monitoring';
import { parameterList } from '../../defaults';
import SensorMap from './sensorMap';
import Uuid from 'uuid';

interface IProps {
  rtm: Rtm;
  sensor: Sensor | null;
  selectedParameter: ISensorParameter | null;
  onChange: (sensor: Sensor) => void;
  onChangeSelectedParameter: (parameter: ISensorParameter) => void;
}

interface IActiveInput {
  name: string;
  value: string;
}

const SensorMetadata = (props: IProps) => {
  const [activeInput, setActiveInput] = useState<IActiveInput | null>(null);
  const [customParameter, setCustomParameter] = useState<ISensorParameter | null>(null);

  const handleLocalChange = (e: ChangeEvent<HTMLInputElement>, { name, value }: InputOnChangeData) =>
    setActiveInput({ name, value });

  const handleChangeCustomParameter = (e: ChangeEvent<HTMLInputElement>, { name, value }: InputOnChangeData) => {
    if (customParameter) {
      return setCustomParameter({
        ...customParameter,
        [name]: value,
      });
    }
  };

  const handleChange = () => {
    if (activeInput && props.sensor) {
      const n = activeInput.name;
      const v = activeInput.value;
      const sensor = Sensor.fromObject(props.sensor.toObject());

      if (n === 'name') {
        sensor.name = v;
      }

      if (n === 'lat') {
        if (!isNaN(parseFloat(v))) {
          sensor.geolocation.coordinates[1] = parseFloat(v);
        }
      }

      if (n === 'lon') {
        if (!isNaN(parseFloat(v))) {
          sensor.geolocation.coordinates[0] = parseFloat(v);
        }
      }

      setActiveInput(null);
      props.onChange(sensor);
    }
  };

  const handleChangeGeometry = (geometry: Point) => {
    if (props.sensor) {
      const sensor = Sensor.fromObject(props.sensor.toObject());
      sensor.geolocation = geometry;
      props.onChange(sensor);
    }
  };

  const handleChangeParameters = (parameters: ParameterCollection) => {
    if (props.sensor) {
      const sensor = Sensor.fromObject(props.sensor.toObject());
      sensor.parameters = parameters;
      props.onChange(sensor);
    }
  };

  const handleAddParameter = (pType: string, param?: ISensorParameter) => () => {
    if (props.sensor) {
      const params = ParameterCollection.fromObject(props.sensor.parameters.toObject());
      const id = Uuid.v4();

      if (pType === 'other' && !param) {
        return setCustomParameter({
          id,
          type: '',
          description: 'New Parameter',
          dataSources: [],
          processings: [],
          unit: '',
        });
      }
      if (pType === 'other' && param) {
        if (params.findById(param.id)) {
          params.update(param);
        } else {
          params.add(param);
        }
        setCustomParameter(null);
      }
      if (pType !== 'other') {
        params.add({
          id,
          type: pType,
          description: parameterList.filter((i: ISensorParameter) => i.type === pType)[0].description,
          dataSources: [],
          processings: [],
        });
      }
      handleChangeParameters(params);
    }
  };

  const handleDeleteParameter = (id: string) => () => {
    if (!props.sensor) {
      return;
    }

    const parameters = ParameterCollection.fromObject(props.sensor.parameters.toObject()).removeById(id);
    const sensor = Sensor.fromObject(props.sensor.toObject());
    sensor.parameters = parameters;
    props.onChange(sensor);
  };

  const handleEditParameter = (param: ISensorParameter) => () => setCustomParameter(param);

  if (!props.sensor) {
    return <h1>Please Select or add a Sensor</h1>;
  }

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={8}>
          <SensorMap
            geometry={props.sensor.geolocation}
            onChangeGeometry={handleChangeGeometry}
            rtm={props.rtm}
            sensor={props.sensor}
            readOnly={props.rtm.readOnly}
          />
        </Grid.Column>
        <Grid.Column width={8}>
          <Segment color={'blue'}>
            <Form>
              <Form.Input
                label={'Name'}
                name={'name'}
                value={activeInput && activeInput.name === 'name' ? activeInput.value : props.sensor.name}
                onBlur={handleChange}
                onChange={handleLocalChange}
                disabled={props.rtm.readOnly}
              />
              <Form.Group>
                <Form.Input
                  width={8}
                  label={'Lat'}
                  name={'lat'}
                  value={
                    activeInput && activeInput.name === 'lat'
                      ? activeInput.value
                      : props.sensor.geolocation.coordinates[1]
                  }
                  onBlur={handleChange}
                  onChange={handleLocalChange}
                  type={'number'}
                  disabled={props.rtm.readOnly}
                />
                <Form.Input
                  width={8}
                  label={'Lon'}
                  name={'lon'}
                  value={
                    activeInput && activeInput.name === 'lon'
                      ? activeInput.value
                      : props.sensor.geolocation.coordinates[0]
                  }
                  onBlur={handleChange}
                  onChange={handleLocalChange}
                  type={'number'}
                  disabled={props.rtm.readOnly}
                />
              </Form.Group>
            </Form>
          </Segment>

          <Table color={'grey'}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Parameter</Table.HeaderCell>
                <Table.HeaderCell>Sources</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {props.sensor.parameters.all.map((p: ISensorParameter) => (
                <Table.Row key={p.id} selected={props.selectedParameter?.id === p.id}>
                  <Table.Cell onClick={() => props.onChangeSelectedParameter(p)} style={{ cursor: 'Pointer' }}>
                    {props.selectedParameter?.id === p.id ? (
                      <Label ribbon={true} color={'red'}>
                        {p.description}
                      </Label>
                    ) : (
                      p.description
                    )}
                  </Table.Cell>
                  <Table.Cell>{p.dataSources.length}</Table.Cell>
                  <Table.Cell textAlign={'right'}>
                    {!props.rtm.readOnly && (
                      <Button.Group>
                        <Button icon="edit" onClick={handleEditParameter(p)} />
                        <Button icon="trash" onClick={handleDeleteParameter(p.id)} />
                      </Button.Group>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>

            {!props.rtm.readOnly && (
              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell colSpan={4}>
                    <Button as="div" labelPosition="left" floated={'right'}>
                      <Dropdown
                        text="Add"
                        icon="add"
                        labeled={true}
                        button={true}
                        className="icon blue"
                        disabled={props.rtm.readOnly}
                      >
                        <Dropdown.Menu>
                          <Dropdown.Header>Choose type</Dropdown.Header>
                          {parameterList.map((p: ISensorParameter) => (
                            <Dropdown.Item
                              key={p.id}
                              text={p.description + (p.unit ? ` (${p.unit})` : '')}
                              onClick={handleAddParameter(p.id)}
                            />
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Button>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            )}
          </Table>
        </Grid.Column>
      </Grid.Row>
      {customParameter && (
        <Modal open={true} onClose={() => setCustomParameter(null)}>
          <Header>Add custom parameter</Header>
          <Modal.Content>
            <Form>
              <Form.Group widths="equal">
                <Form.Input
                  fluid={true}
                  label="Type"
                  name="type"
                  onChange={handleChangeCustomParameter}
                  value={customParameter.type}
                />
                <Form.Input
                  fluid={true}
                  label="Description"
                  name="description"
                  onChange={handleChangeCustomParameter}
                  value={customParameter.description}
                />
                <Form.Input
                  fluid={true}
                  label="Unit"
                  name="unit"
                  onChange={handleChangeCustomParameter}
                  value={customParameter.unit}
                />
              </Form.Group>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handleAddParameter('other', customParameter)} primary={true}>
              Submit
            </Button>
          </Modal.Actions>
        </Modal>
      )}
    </Grid>
  );
};

export default SensorMetadata;
