import {Point} from 'geojson';
import moment from 'moment';
import React, {ChangeEvent, useEffect, useState} from 'react';
import {
    Button,
    Dropdown,
    Form,
    Grid,
    Header,
    Icon,
    InputOnChangeData,
    Label,
    Modal,
    Segment,
    Table
} from 'semantic-ui-react';
import uuid from 'uuid';
import Uuid from 'uuid';
import {Rtm, Sensor} from '../../../core/model/rtm';
import {ParameterCollection} from '../../../core/model/rtm/ParameterCollection';
import {IDataSource} from '../../../core/model/rtm/Sensor.type';
import {dataSourceList, parameterList} from '../defaults';
import {CSVDatasource, OnlineDatasource, SensorMap} from './index';

interface IProps {
    rtm: Rtm;
    sensor: Sensor;
    onChange: (sensor: Sensor) => void;
}

interface IActiveInput {
    name: string;
    value: string;
}

const sensorSetupDetails = (props: IProps) => {

    const [activeInput, setActiveInput] = useState<IActiveInput | null>(null);
    const [datasource, setDatasource] = useState<IDataSource | null>(null);
    const [selectedParameterId, setSelectedParameterId] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedParameterId && props.sensor.parameters.length > 0) {
            setSelectedParameterId(props.sensor.parameters.first.id);
        }
    }, []);

    const handleLocalChange = (e: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => setActiveInput({
        name: data.name,
        value: data.value
    });

    const handleChange = () => {
        if (activeInput) {
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
        const sensor = Sensor.fromObject(props.sensor.toObject());
        sensor.geolocation = geometry;
        props.onChange(sensor);
    };

    const handleChangeParameters = (parameters: ParameterCollection) => {
        const sensor = Sensor.fromObject(props.sensor.toObject());
        sensor.parameters = parameters;
        props.onChange(sensor);
    };

    const handleAddParameter = (pType: string) => () => {
        const params = ParameterCollection.fromObject(props.sensor.parameters.toObject());
        const id = Uuid.v4();
        params.add({
            id,
            type: pType,
            description: '',
            dataSources: [],
            filters: [],
            data: []
        });
        handleChangeParameters(params);
        setSelectedParameterId(id);
    };

    const handleAddDataSourceClick = (dsType: string) => () => {
        if (dsType === 'csv') {
            setDatasource({id: uuid.v4(), type: dsType});
        }

        if (dsType === 'online') {
            setDatasource({id: uuid.v4(), type: dsType});
        }
    };

    const handleCancelAddDataSourceClick = () => {
        setDatasource(null);
    };

    const handleAddEditDataSource = () => {
        const sensor = Sensor.fromObject(props.sensor.toObject());
        const param = selectedParameterId && props.sensor.parameters.findById(selectedParameterId);
        if (!param || !datasource) {
            return;
        }

        let add = true;
        param.dataSources = param.dataSources.map((ds) => {
            if (ds.id === datasource.id) {
                add = false;
                return datasource;
            }

            return ds;
        });

        if (add) {
            param.dataSources.push(datasource);
        }

        sensor.parameters = sensor.parameters.update(param);
        props.onChange(sensor);
        setDatasource(null);
    };

    const handleEditDataSourceClick = (id: string) => () => {
        const param = selectedParameterId && props.sensor.parameters.findById(selectedParameterId);

        if (!param) {
            return;
        }

        const filteredDs = param.dataSources.filter((ds: IDataSource) => ds.id === id);
        if (filteredDs.length === 0) {
            return;
        }

        setDatasource(filteredDs[0]);
    };

    const handleDeleteDataSourceClick = (id: string) => () => {
        const sensor = Sensor.fromObject(props.sensor.toObject());
        const param = selectedParameterId && sensor.parameters.findById(selectedParameterId);

        if (!param) {
            return;
        }

        param.dataSources = param.dataSources.filter((ds: IDataSource) => ds.id !== id);
        sensor.parameters = sensor.parameters.update(param);
        props.onChange(sensor);
    };

    const handleDeleteParameter = (id: string) => () => {
        const parameters = ParameterCollection.fromObject(props.sensor.parameters.toObject()).removeById(id);
        const sensor = Sensor.fromObject(props.sensor.toObject());
        sensor.parameters = parameters;
        props.onChange(sensor);
    };

    const renderAddEditDataSource = () => {
        if (!datasource) {
            return null;
        }

        if (datasource.type === 'csv') {
            return (
                <CSVDatasource dataSource={datasource} onChange={setDatasource}/>
            );
        }

        if (datasource.type === 'online') {
            return (
                <OnlineDatasource dataSource={datasource} onChange={setDatasource}/>
            );
        }
    };

    const getTimeRangeText = (timeRange: any) => {
        if (!timeRange) {
            return '-';
        }

        const [beginTimeStamp, endTimeStamp] = timeRange;

        let begin = '';
        if (beginTimeStamp) {
            begin = moment.unix(beginTimeStamp).format('YYYY/MM/DD');
        }

        let end = '';
        if (endTimeStamp) {
            end = moment.unix(endTimeStamp).format('YYYY/MM/DD');
        }

        return `${begin} - ${end}`;
    };

    const getValueRangeText = (valueRange: any) => {
        if (!valueRange) {
            return '-';
        }

        const [minValue, maxValue] = valueRange;

        if (minValue && maxValue) {
            return `${minValue} - ${maxValue}`;
        }

        if (minValue) {
            return `>= ${minValue}`;
        }

        if (maxValue) {
            return `<= ${maxValue}`;
        }
    };

    const parameter = selectedParameterId && props.sensor.parameters.findById(selectedParameterId);
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
                                        onClick={() => setSelectedParameterId(p.id)}
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

            {parameter &&
            <Grid.Row>
                <Grid.Column>
                    <Segment color={'red'} raised={true}>
                        <Header as={'h2'} dividing={true}>
                            {parameterList.filter((i) => i.parameter === parameter.type)[0].text}
                        </Header>
                        <Label color={'blue'} ribbon={true} size={'large'}>
                            Data sources
                        </Label>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Type</Table.HeaderCell>
                                    <Table.HeaderCell>Time range</Table.HeaderCell>
                                    <Table.HeaderCell>Value range</Table.HeaderCell>
                                    <Table.HeaderCell/>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {parameter.dataSources.map((ds, key) => (
                                    <Table.Row key={key}>
                                        <Table.Cell>{ds.type}</Table.Cell>
                                        <Table.Cell>{getTimeRangeText(ds.timeRange)}</Table.Cell>
                                        <Table.Cell>{getValueRangeText(ds.valueRange)}</Table.Cell>
                                        <Table.Cell textAlign={'right'}>
                                            {!props.rtm.readOnly &&
                                            <Button.Group>
                                                <Button icon={true} onClick={handleEditDataSourceClick(ds.id)}>
                                                    <Icon name={'edit'}/>
                                                </Button>
                                                <Button icon={true} onClick={handleDeleteDataSourceClick(ds.id)}>
                                                    <Icon name={'trash'}/>
                                                </Button>
                                            </Button.Group>}
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
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
                                                    {dataSourceList.map((ds) =>
                                                        <Dropdown.Item
                                                            key={ds}
                                                            text={ds}
                                                            onClick={handleAddDataSourceClick(ds)}
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
                    </Segment>
                </Grid.Column>
            </Grid.Row>}

            {datasource &&
            <Modal centered={false} open={true} dimmer={'blurring'}>
                <Modal.Header>Add Datasource</Modal.Header>
                <Modal.Content>
                    {renderAddEditDataSource()}
                </Modal.Content>
                <Modal.Actions>
                    <Button negative={true} onClick={handleCancelAddDataSourceClick}>Cancel</Button>
                    <Button positive={true} onClick={handleAddEditDataSource}>Apply</Button>
                </Modal.Actions>
            </Modal>}
        </Grid>
    );
};

export default sensorSetupDetails;
