import {Point} from 'geojson';
import React, {ChangeEvent, useEffect, useState} from 'react';
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
    Table
} from 'semantic-ui-react';
import Uuid from 'uuid';
import {Rtm, Sensor} from '../../../core/model/rtm';
import {ParameterCollection} from '../../../core/model/rtm/ParameterCollection';
import {ISensorParameter} from '../../../core/model/rtm/Sensor.type';
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

const SensorMetadata = (props: IProps) => {
    const [activeInput, setActiveInput] = useState<IActiveInput | null>(null);
    const [customParameter, setCustomParameter] = useState<ISensorParameter | null>(null);
    const [selectedParameterId, setSelectedParameterId] = useState<string | null>(null);

    useEffect(() => {
        if (props.sensor && !selectedParameterId && props.sensor.parameters.length > 0) {
            setSelectedParameterId(props.sensor.parameters.first.id);
            props.onChangeSelectedParameterId(props.sensor.parameters.first.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.sensor]);

    useEffect(() => {
        if (!selectedParameterId) {
            return;
        }

        props.onChangeSelectedParameterId(selectedParameterId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedParameterId]);

    const handleLocalChange = (e: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => setActiveInput({
        name: data.name,
        value: data.value
    });

    const handleChangeCustomParameter = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        if (customParameter) {
            return setCustomParameter({
                ...customParameter,
                [name]: value
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
                    unit: ''
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
                    description: parameterList.filter((i) => i.type === pType)[0].description,
                    dataSources: [],
                    processings: []
                });
            }
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

    const handleEditParameter = (param: ISensorParameter) => () => setCustomParameter(param);

    const handleSelectParameter = (id: string) => () => {
        setSelectedParameterId(id);
    };

    const getDescription = (param: ISensorParameter) => {
        const defaultParameter = parameterList.filter((i) => i.type === param.type);
        if (defaultParameter.length > 0) {
            return defaultParameter[0].description;
        }
        if (param.description !== '') {
            return param.description;
        }
        return 'Other';
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
                                                {getDescription(p)}
                                            </Label> :
                                            getDescription(p)
                                        }

                                    </Table.Cell>
                                    <Table.Cell>{p.dataSources.length}</Table.Cell>
                                    <Table.Cell textAlign={'right'}>
                                        {!props.rtm.readOnly &&
                                        <Button.Group>
                                            <Button icon="edit" onClick={handleEditParameter(p)}/>
                                            <Button icon="trash" onClick={handleDeleteParameter(p.id)}/>
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
                                                        key={o.id}
                                                        text={o.description + (o.unit ? ` (${o.unit})` : '')}
                                                        onClick={handleAddParameter(o.id)}
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
            {customParameter &&
            <Modal
                open={true}
                onClose={() => setCustomParameter(null)}
            >
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
                    <Button
                        onClick={handleAddParameter('other', customParameter)}
                        primary={true}
                    >
                        Submit
                    </Button>
                </Modal.Actions>
            </Modal>
            }
        </Grid>
    );
};

export default SensorMetadata;
