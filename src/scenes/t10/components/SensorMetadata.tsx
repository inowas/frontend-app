import {Point} from 'geojson';
import React, {ChangeEvent, useEffect, useState} from 'react';
import {
    Button,
    Dropdown,
    Form,
    Grid,
    Icon,
    InputOnChangeData,
    Label,
    Segment,
    Table
} from 'semantic-ui-react';
import Uuid from 'uuid';
import {Rtm, Sensor} from '../../../core/model/rtm';
import {ParameterCollection} from '../../../core/model/rtm/ParameterCollection';
import {parameterList} from '../defaults';
import {SensorMap} from './index';

interface IProps {
    rtm: Rtm;
    sensor: Sensor | null;
    onChange: (sensor: Sensor) => void;
    onChangeSelectedParameterId: (id: string) => void;
}

interface IActiveInput {
    name: string;
    value: string;
}

const sensorMetadata = (props: IProps) => {

    const [activeInput, setActiveInput] = useState<IActiveInput | null>(null);
    const [selectedParameterId, setSelectedParameterId] = useState<string | null>(null);

    useEffect(() => {
        if (props.sensor && !selectedParameterId && props.sensor.parameters.length > 0) {
            setSelectedParameterId(props.sensor.parameters.first.id);
            props.onChangeSelectedParameterId(props.sensor.parameters.first.id);
        }
    }, [props.sensor]);

    useEffect(() => {
        if (!selectedParameterId) {
            return;
        }

        props.onChangeSelectedParameterId(selectedParameterId);
    }, [selectedParameterId]);

    const handleLocalChange = (e: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => setActiveInput({
        name: data.name,
        value: data.value
    });

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

    const handleAddParameter = (pType: string) => () => {
        if (props.sensor) {
            const params = ParameterCollection.fromObject(props.sensor.parameters.toObject());
            const id = Uuid.v4();
            params.add({
                id,
                type: pType,
                description: '',
                dataSources: [],
                processings: []
            });
            handleChangeParameters(params);
            setSelectedParameterId(id);
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

    const handleSelectParameter = (id: string) => () => {
        setSelectedParameterId(id);
    };

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
                                value={activeInput && activeInput.name === 'name' ?
                                    activeInput.value : props.sensor.name}
                                onBlur={handleChange}
                                onChange={handleLocalChange}
                                disabled={props.rtm.readOnly}
                            />
                            <Form.Group>
                                <Form.Input
                                    width={8}
                                    label={'Lat'}
                                    name={'lat'}
                                    value={activeInput && activeInput.name === 'lat' ?
                                        activeInput.value : props.sensor.geolocation.coordinates[1]}
                                    onBlur={handleChange}
                                    onChange={handleLocalChange}
                                    type={'number'}
                                    disabled={props.rtm.readOnly}
                                />
                                <Form.Input
                                    width={8}
                                    label={'Lon'}
                                    name={'lon'}
                                    value={activeInput && activeInput.name === 'lon' ?
                                        activeInput.value : props.sensor.geolocation.coordinates[0]}
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
                                <Table.HeaderCell/>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {props.sensor.parameters.all.map((p) =>
                                <Table.Row
                                    key={p.id}
                                    selected={selectedParameterId === p.id}
                                >
                                    <Table.Cell
                                        onClick={handleSelectParameter(p.id)}
                                        style={{cursor: 'Pointer'}}
                                    >
                                        {selectedParameterId === p.id ?
                                            <Label ribbon={true} color={'red'}>
                                                {parameterList.filter((i) => i.parameter === p.type)[0].text}
                                            </Label> :
                                            parameterList.filter((i) => i.parameter === p.type)[0].text
                                        }

                                    </Table.Cell>
                                    <Table.Cell>{p.dataSources.length}</Table.Cell>
                                    <Table.Cell textAlign={'right'}>
                                        {!props.rtm.readOnly &&
                                        <Button.Group>
                                            <Button icon={true} onClick={handleDeleteParameter(p.id)}>
                                                <Icon name={'trash'}/>
                                            </Button>
                                        </Button.Group>}
                                    </Table.Cell>
                                </Table.Row>)}
                        </Table.Body>

                        {!props.rtm.readOnly &&
                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell colSpan={4}>
                                    <Button
                                        as="div"
                                        labelPosition="left"
                                        floated={'right'}
                                    >
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
                                                {parameterList.map((o) =>
                                                    <Dropdown.Item
                                                        key={o.parameter}
                                                        text={o.text}
                                                        onClick={handleAddParameter(o.parameter)}
                                                    />
                                                )}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Button>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                        }
                    </Table>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default sensorMetadata;
