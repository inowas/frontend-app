import {Button, Form, Grid, Header, Label, Modal, Segment} from 'semantic-ui-react';
import {DataPoint, LTOB} from 'downsample';
import {DatePicker} from '../../shared/uiComponents';
import {IDateTimeValue} from '../../../core/model/rtm/Sensor.type';
import {ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import {fetchUrl} from '../../../services/api';
import {maxBy, minBy, uniqBy} from 'lodash';
import {usePrevious} from '../../shared/simpleTools/helpers/customHooks';
import React, {useEffect, useState} from 'react';
import SensorDataSource from '../../../core/model/rtm/SensorDataSource';
import moment from 'moment';
import uuid from 'uuid';

interface IProps {
    dataSource?: SensorDataSource;
    onSave: (ds: SensorDataSource) => void;
    onCancel: () => void;
}

interface ISensorMetaData {
    name: string;
    location: string;
    project: string;
    properties?: string[]; // uit-sensors.inowas.com - metadata, deprecated
    parameters?: string[]; // sensors.inowas.com - the new server
    last: {
        date_time: string,
        data: { [name: string]: number };
    };
}

const SensorDatasourceEditor = (props: IProps) => {

    const servers = [
        {
            protocol: 'https',
            url: 'uit-sensors.inowas.com',
            path: 'sensors'
        },
        {
            protocol: 'https',
            url: 'sensors.inowas.com',
            path: 'sensors'
        }
    ];

    const [dataSource, setDatasource] = useState<SensorDataSource | null>(null);
    const [fetchingServerMetaData, setFetchingServerMetaData] = useState<boolean>(false);
    const [fetchingError] = useState<boolean>(false);

    const [server, setServer] = useState<string | null>(null);
    const [sensorServerMetaData, setSensorServerMetaData] = useState<ISensorMetaData[]>([]);

    const prevUrl = usePrevious(dataSource && dataSource.url.toString());

    const [begin, setBegin] = useState<number | null>(null);
    const [end, setEnd] = useState<number | null>(null);
    const [min, setMin] = useState<number | null>(null);
    const [max, setMax] = useState<number | null>(null);

    const fetchData = async (d: SensorDataSource) => {
        const ds = SensorDataSource.fromObject(d.toObject());
        await ds.loadData();
        setDatasource(ds);
    };

    useEffect(() => {
            if (props.dataSource === undefined) {
                return setServer(servers[0].url);
            }

            const ds = SensorDataSource.fromObject(props.dataSource.toObject());
            if (!ds.data) {
                fetchData(ds).then();
            }

            if (ds.begin !== null) {
                setBegin(ds.begin);
            }

            if (ds.end !== null) {
                setEnd(ds.end);
            }

            if (ds.min !== null) {
                setMin(ds.min);
            }

            if (ds.max !== null) {
                setMin(ds.max);
            }

            setDatasource(ds);
            setServer(props.dataSource.server);

        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useEffect(() => {
        if (!server) {
            return;
        }

        fetchServerMetadata(server);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [server]);

    useEffect(() => {
        if (sensorServerMetaData.length === 0) {
            return;
        }

        if (!server) {
            return;
        }

        if (!dataSource) {
            const sensorMetaData = sensorServerMetaData[0];
            const {project, name, properties, parameters} = sensorMetaData;

            if (properties && properties.length === 0) {
                return;
            }

            if (parameters && parameters.length === 0) {
                return;
            }

            const params = properties || parameters;

            if (!params) {
                return;
            }

            const ds = SensorDataSource.fromParams(server, project, name, params[0]);
            if (!(ds instanceof SensorDataSource)) {
                return;
            }

            setDatasource(ds);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sensorServerMetaData]);

    useEffect(() => {
            if (dataSource && dataSource.url.toString() !== prevUrl) {
                fetchData(dataSource);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dataSource]
    );

    const handleSave = () => {
        if (dataSource) {
            props.onSave(dataSource);
        }
    };

    const handleGenericChange = (f: (v: any) => void) => (e: any, d: any) => {

        // eslint-disable-next-line no-prototype-builtins
        if (d && d.hasOwnProperty('value')) {
            return f(d.value);
        }

        // eslint-disable-next-line no-prototype-builtins
        if (d && d.hasOwnProperty('checked')) {
            return f(d.checked);
        }

        return f(e.target.value);
    };

    const handleChangeServer = (e: any, d: any) => {
        if (!(dataSource instanceof SensorDataSource)) {
            return;
        }

        dataSource.server = d.value;
        setServer(d.value);
    };

    const handleChangeProject = (e: any, d: any) => {
        if (!(dataSource instanceof SensorDataSource)) {
            return;
        }

        const ds = SensorDataSource.fromObject(dataSource.toObject());
        ds.project = d.value;
        setDatasource(ds);
    };

    const handleChangeSensor = (e: any, d: any) => {
        if (!(dataSource instanceof SensorDataSource)) {
            return;
        }

        const ds = SensorDataSource.fromObject(dataSource.toObject());
        ds.sensor = d.value;
        setDatasource(ds);
    };

    const handleChangeParameter = (e: any, d: any) => {
        if (!(dataSource instanceof SensorDataSource)) {
            return;
        }

        const ds = SensorDataSource.fromObject(dataSource.toObject());
        ds.parameter = d.value;
        setDatasource(ds);
    };

    const handleChangeCheckbox = (e: any, d: any) => {

        if (!(dataSource instanceof SensorDataSource)) {
            return;
        }

        const {data} = dataSource;
        if (!data) {
            return;
        }

        const ds = SensorDataSource.fromObject(dataSource.toObject());

        if (d.name === 'begin') {
            if (d.checked) {
                ds.begin = data[0].timeStamp;
                if (!begin) {
                    setBegin(data[0].timeStamp);
                }
            }

            if (!d.checked) {
                ds.begin = null;
            }
        }

        if (d.name === 'end') {
            if (d.checked) {
                ds.end = data[data.length - 1].timeStamp;
                if (!end) {
                    setEnd(data[data.length - 1].timeStamp);
                }
            }

            if (!d.checked) {
                ds.end = null;
            }
        }

        if (d.name === 'min') {
            if (d.checked) {
                const minDtValue: IDateTimeValue | undefined = minBy(data, 'value');
                if (minDtValue) {
                    ds.min = minDtValue.value;
                    setMin(minDtValue.value);
                }
            }

            if (!d.checked) {
                ds.min = null;
            }
        }

        if (d.name === 'max') {
            if (d.checked) {
                const maxDtValue: IDateTimeValue | undefined = maxBy(data, 'value');
                if (maxDtValue) {
                    ds.max = maxDtValue.value;
                    setMax(maxDtValue.value);
                }
            }

            if (!d.checked) {
                ds.max = null;
            }
        }

        setDatasource(ds);
    };

    const handleBlur = (param: string) => () => {
        if (!(dataSource instanceof SensorDataSource)) {
            return;
        }

        const ds = SensorDataSource.fromObject(dataSource.toObject());

        if (param === 'begin') {
            ds.begin = begin;
        }

        if (param === 'end') {
            ds.end = end;
        }

        if (param === 'min') {
            ds.min = min;
        }

        if (param === 'max') {
            ds.max = max;
        }

        setDatasource(ds);
    };

    const adding = () => !(props.dataSource instanceof SensorDataSource);

    const fetchServerMetadata = (serverUrl: string | null) => {
        if (!serverUrl) {
            return;
        }

        const filteredServers = servers.filter((s) => s.url = serverUrl);
        if (filteredServers.length === 0) {
            return;
        }

        const srv = filteredServers[0];

        setFetchingServerMetaData(true);

        let url = new URL(`${srv.protocol}://${srv.url}/${srv.path}`).toString();

        // URL 'uit-sensors.inowas.com' needs to finish with a dash
        // it's a dirty fix but it works
        if (srv.url === 'uit-sensors.inowas.com') {
            url += '/';
        }

        fetchUrl(
            url,
            (d: ISensorMetaData[]) => {
                setSensorServerMetaData(d);
                setFetchingServerMetaData(false);
            },
            () => {
                setFetchingServerMetaData(false);
            });
    };

    const formatDateTimeTicks = (dt: number) => {
        return moment.unix(dt).format('YYYY/MM/DD');
    };

    // tslint:disable-next-line:variable-name
    const RenderNoShape = () => null;

    const renderDiagram = () => {
        if (!(dataSource instanceof SensorDataSource)) {
            return (
                <Header as={'h2'}>No data</Header>
            );
        }

        const {data} = dataSource;
        if (!data) {
            return;
        }

        const downSampledDataLTOB: DataPoint[] = LTOB(data.map((d: IDateTimeValue) => ({
            x: d.timeStamp,
            y: d.value
        })), 200);

        return (
            <ResponsiveContainer height={300}>
                <ScatterChart>
                    <XAxis
                        dataKey={'x'}
                        domain={[
                            data.length > 0 ? data[0].timeStamp : 'auto',
                            data.length > 0 ? data[data.length - 1].timeStamp : 'auto'
                        ]}
                        name={'Date Time'}
                        tickFormatter={formatDateTimeTicks}
                        type={'number'}
                    />
                    <YAxis dataKey={'y'} name={dataSource.parameter} domain={['auto', 'auto']}/>
                    <Scatter
                        data={downSampledDataLTOB}
                        line={{stroke: '#1eb1ed', strokeWidth: 2}}
                        lineType={'joint'}
                        name={dataSource.parameter}
                        shape={<RenderNoShape/>}
                    />
                </ScatterChart>
            </ResponsiveContainer>
        );
    };

    const getParametersFromMetadata = (dataSource: SensorDataSource, sensorServerMetaData: ISensorMetaData[]) => {
        if (!dataSource) {
            return [];
        }

        if (sensorServerMetaData.filter((s) => s.project === dataSource.project).filter((s) => s.name === dataSource.sensor).length === 0) {
            return [];
        }

        const sensorMetaData = sensorServerMetaData.filter((s) => s.project === dataSource.project)
            .filter((s) => s.name === dataSource.sensor)[0];

        if (sensorMetaData.parameters) {
            return sensorMetaData.parameters.map((p, idx) => ({key: idx, value: p, text: p}));
        }

        if (sensorMetaData.properties) {
            return sensorMetaData.properties.map((p, idx) => ({key: idx, value: p, text: p}));
        }
    };

    return (
        <Modal centered={false} open={true} dimmer={'blurring'}>
            {adding() && <Modal.Header>Add Datasource</Modal.Header>}
            {!adding() && <Modal.Header>Edit Datasource</Modal.Header>}
            <Modal.Content>
                <Grid padded={true}>
                    <Grid.Row>
                        <Grid.Column>
                            <Form>
                                <Segment raised={true} color={fetchingError ? 'red' : undefined}>
                                    <Label as={'div'} color={'blue'} ribbon={true}>Server</Label>
                                    <Form.Dropdown
                                        loading={fetchingServerMetaData}
                                        width={6}
                                        name={'server'}
                                        selection={true}
                                        value={dataSource ? dataSource.server : (server || undefined)}
                                        onChange={handleChangeServer}
                                        options={servers.map((s) => ({key: uuid.v4(), value: s.url, text: s.url}))}
                                    />
                                </Segment>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Segment
                                raised={true}
                                loading={fetchingServerMetaData}
                                color={fetchingError ? 'red' : undefined}
                            >
                                <Label as={'div'} color={'blue'} ribbon={true}>Metadata</Label>
                                <Form>
                                    <Form.Group>
                                        <Form.Dropdown
                                            label={'Project'}
                                            name={'project'}
                                            selection={true}
                                            value={dataSource ? dataSource.project : undefined}
                                            onChange={handleChangeProject}
                                            options={uniqBy(sensorServerMetaData, 'project').map((s, idx) => ({
                                                key: idx,
                                                value: s.project,
                                                text: s.project
                                            }))}
                                        />

                                        {dataSource && <Form.Dropdown
                                            label={'Sensor'}
                                            name={'sensor'}
                                            selection={true}
                                            value={dataSource.sensor}
                                            onChange={handleChangeSensor}
                                            options={sensorServerMetaData.filter(
                                                (s) => s.project === (dataSource.project))
                                                .map((s, idx) => ({
                                                    key: idx,
                                                    value: s.name,
                                                    text: s.name
                                                }))}
                                            disabled={!dataSource.project}
                                        />}

                                        {dataSource && <Form.Dropdown
                                            label={'Parameter'}
                                            name={'parameter'}
                                            selection={true}
                                            value={dataSource.parameter}
                                            onChange={handleChangeParameter}
                                            options={getParametersFromMetadata(dataSource, sensorServerMetaData)}
                                            disabled={!dataSource.sensor}
                                        />}
                                    </Form.Group>
                                </Form>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>

                    {dataSource &&
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Segment raised={true} loading={fetchingServerMetaData}>
                                <Label as={'div'} color={'blue'} ribbon={true}>Time range</Label>
                                <Form>
                                    <Form.Group>
                                        <Form.Checkbox
                                            name={'begin'}
                                            style={{marginTop: '30px'}}
                                            toggle={true}
                                            checked={!!dataSource.begin}
                                            onChange={handleChangeCheckbox}
                                        />
                                        <DatePicker
                                            label={'Start'}
                                            name={'start'}
                                            value={begin ? moment.unix(begin).toDate() : null}
                                            onChange={handleGenericChange((d) => setBegin(moment.utc(d).unix()))}
                                            onBlur={handleBlur('begin')}
                                            size={'small'}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Checkbox
                                            name={'end'}
                                            style={{marginTop: '30px'}}
                                            toggle={true}
                                            checked={!!dataSource.end}
                                            onChange={handleChangeCheckbox}
                                        />
                                        <DatePicker
                                            label={'End'}
                                            name={'end'}
                                            value={end ? moment.unix(end).toDate() : null}
                                            onChange={handleGenericChange((d) => setEnd(moment.utc(d).unix()))}
                                            onBlur={handleBlur('end')}
                                            size={'small'}
                                        />
                                    </Form.Group>

                                </Form>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Segment raised={true} loading={fetchingServerMetaData}>
                                <Label as={'div'} color={'blue'} ribbon={true}>Value range</Label>
                                <Form>
                                    <Form.Group>
                                        <Form.Checkbox
                                            name={'max'}
                                            style={{marginTop: '30px'}}
                                            toggle={true}
                                            checked={dataSource.max !== null}
                                            onChange={handleChangeCheckbox}
                                        />
                                        <Form.Input
                                            label={'Upper limit'}
                                            type={'number'}
                                            value={max !== null ? max : ''}
                                            disabled={dataSource.max == null}
                                            onChange={handleGenericChange((d) => setMax(d))}
                                            onBlur={handleBlur('max')}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Checkbox
                                            name={'min'}
                                            style={{marginTop: '30px'}}
                                            toggle={true}
                                            checked={dataSource.min !== null}
                                            onChange={handleChangeCheckbox}
                                        />
                                        <Form.Input
                                            label={'Lower limit'}
                                            type={'number'}
                                            value={min !== null ? min : ''}
                                            disabled={dataSource.min === null}
                                            onChange={handleGenericChange((d) => setMin(d))}
                                            onBlur={handleBlur('min')}
                                        />
                                    </Form.Group>
                                </Form>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    }

                    {dataSource &&
                    <Grid.Row>
                        <Grid.Column>
                            <Segment loading={!dataSource.data} raised={true}>
                                <Label as={'div'} color={'red'} ribbon={true}>Data</Label>
                                {renderDiagram()}
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    }

                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Button negative={true} onClick={props.onCancel}>Cancel</Button>
                <Button positive={true} onClick={handleSave}>Apply</Button>
            </Modal.Actions>
        </Modal>
    );

};

export default SensorDatasourceEditor;
