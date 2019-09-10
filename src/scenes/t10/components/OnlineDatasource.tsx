import {uniqBy} from 'lodash';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import {Form, Grid, Header, Segment} from 'semantic-ui-react';
import {IDataSource, IDateTimeValue} from '../../../core/model/rtm/Sensor.type';
import {fetchUrl} from '../../../services/api';

interface IProps {
    datasource: IDataSource;
    onChange: (ds: IDataSource) => void;
}

export const servers = [{
    protocol: 'https',
    url: 'uit-sensors.inowas.com',
    path: 'sensors'
}];

interface ISensorMetaData {
    name: string;
    location: string;
    project: string;
    properties: string[];
    last: {
        date_time: string,
        data: { [name: string]: number };
    };
}

const onlineDataSource = (props: IProps) => {

    const [data, setData] = useState<IDateTimeValue[] | null>(null);
    const [fetchingMetadata, setFetchingMetaData] = useState<boolean>(false);
    const [fetchingData, setFetchingData] = useState<boolean>(false);
    const [fetchingError, setFetchingError] = useState<boolean>(false);

    const [server, setServer] = useState<string | null>(null);

    const [sensorMetaData, setSensorMetaData] = useState<ISensorMetaData[]>([]);

    const [project, setProject] = useState<string | null>(null);
    const [sensor, setSensor] = useState<string | null>(null);
    const [parameter, setParameter] = useState<string | null>(null);

    useEffect(() => {
        if (props.datasource.server) {
            setServer(props.datasource.server);
        }

        if (props.datasource.queryParams) {
            setProject(props.datasource.queryParams.project);
            setSensor(props.datasource.queryParams.sensor);
            setParameter(props.datasource.queryParams.property);
        }

    }, []);

    useEffect(() => {
        fetchServerMetadata();
    }, [server]);

    useEffect(() => {
        if (server && project && sensor && parameter) {
            executeQuery();
            props.onChange({
                ...props.datasource,
                server,
                queryParams: {
                    sensor, property: parameter, project
                }
            });
        }

    }, [parameter]);

    const handleChange = (f: (v: any) => void) => (e: any, d: any) => f(d.value);

    const fetchServerMetadata = () => {
        if (!server) {
            return;
        }

        const filteredServers = servers.filter((s) => s.url = server);
        if (filteredServers.length === 0) {
            return;
        }

        const srv = filteredServers[0];
        const url = new URL(
            `${srv.path}/`,
            `${srv.protocol}://${srv.url}`
        );

        setFetchingMetaData(true);
        fetchUrl(
            url.toString(),
            (d: ISensorMetaData[]) => {
                setSensorMetaData(d);
                setFetchingMetaData(false);
            },
            () => {
                setFetchingMetaData(false);
                setFetchingError(true);
            });
    };

    const executeQuery = () => {
        if (!(server && project && sensor && parameter)) {
            return;
        }

        const filteredServers = servers.filter((s) => s.url = server);
        if (filteredServers.length === 0) {
            return;
        }

        const srv = filteredServers[0];

        setData(null);
        setFetchingError(false);
        setFetchingData(true);

        const url = new URL(
            `${srv.path}/project/${project}/sensor/${sensor}/property/${parameter}`,
            `${srv.protocol}://${srv.url}`
        );

        fetchUrl(
            url.toString(),
            (response: any) => {
                const d: any = response.map((ds: any) => {
                    const timeStamp = moment.utc(ds.date_time).unix();
                    delete ds.date_time;
                    return {
                        ...ds, timeStamp
                    };
                });
                setData(d);
                setFetchingData(false);
            },
            () => {
                setFetchingData(false);
                setFetchingError(true);
            });
    };

    const formatDateTimeTicks = (dt: number) => {
        return moment.unix(dt).format('YYYY/MM/DD');
    };

    const renderData = () => {
        if (!data || !parameter) {
            return (
                <Header as={'h2'}>No data</Header>
            );
        }

        return (
            <ResponsiveContainer height={300}>
                <ScatterChart>
                    <XAxis
                        dataKey={'timeStamp'}
                        domain={['auto', 'auto']}
                        name={'Date Time'}
                        tickFormatter={formatDateTimeTicks}
                        type={'number'}
                    />
                    <YAxis dataKey={parameter} name={parameter}/>
                    <Scatter
                        data={data}
                        line={{stroke: '#eee'}}
                        lineJointType={'monotoneX'}
                        lineType={'joint'}
                        name={parameter}
                    />
                </ScatterChart>
            </ResponsiveContainer>
        );
    };

    return (
        <Grid padded={true}>
            <Grid.Row>
                <Grid.Column width={6}>
                    <Form>
                        <Form.Dropdown
                            label={'Server'}
                            name={'server'}
                            selection={true}
                            value={server || undefined}
                            onChange={handleChange(setServer)}
                            options={servers.map((s) => ({key: s.url, value: s.url, text: s.url}))}
                        />
                    </Form>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={6}>
                    <Form>
                        {server &&
                        <Segment loading={fetchingMetadata} color={fetchingError ? 'red' : undefined}>
                            {sensorMetaData && <Form.Dropdown
                                label={'Project'}
                                name={'project'}
                                selection={true}
                                value={project || undefined}
                                onChange={handleChange(setProject)}
                                options={uniqBy(sensorMetaData, 'project').map((s, idx) => ({
                                    key: idx,
                                    value: s.project,
                                    text: s.project
                                }))}
                            />}

                            <Form.Dropdown
                                label={'Sensor'}
                                name={'sensor'}
                                selection={true}
                                value={sensor || undefined}
                                onChange={handleChange(setSensor)}
                                options={sensorMetaData.filter((s) => s.project === project).map((s, idx) => ({
                                    key: idx,
                                    value: s.name,
                                    text: s.name
                                }))}
                                disabled={!project}
                            />

                            <Form.Dropdown
                                label={'Parameter'}
                                name={'parameter'}
                                selection={true}
                                value={parameter || undefined}
                                onChange={handleChange(setParameter)}
                                options={sensorMetaData.filter((s) => s.project === project)
                                    .filter((s) => s.name === sensor).length === 0 ? [] :
                                    sensorMetaData.filter((s) => s.project === project)
                                        .filter((s) => s.name === sensor)[0].properties.map((p, idx) => ({
                                        key: idx,
                                        value: p,
                                        text: p
                                    }))
                                }
                                disabled={!sensor}
                            />
                        </Segment>
                        }
                    </Form>
                </Grid.Column>
                <Grid.Column width={10}>
                    {server && <Segment loading={fetchingData}>
                        {renderData()}
                    </Segment>}
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default onlineDataSource;
