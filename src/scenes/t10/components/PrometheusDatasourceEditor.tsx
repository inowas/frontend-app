import {LTOB} from 'downsample';
// @ts-ignore todo
import {DataPoint} from 'downsample/dist/types';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import {Button, Form, Grid, Header, Label, Modal, Segment, TextArea} from 'semantic-ui-react';
import uuid from 'uuid';
import PrometheusDataSource from '../../../core/model/rtm/PrometheusDataSource';
import {usePrevious} from '../../shared/simpleTools/helpers/customHooks';

interface IProps {
    dataSource?: PrometheusDataSource;
    onSave: (ds: PrometheusDataSource) => void;
    onCancel: () => void;
}

export const servers = [{
    protocol: 'https',
    url: 'prometheus.inowas.com'
}];

const PrometheusDatasourceEditor = (props: IProps) => {

    const [dataSource, setDatasource] = useState<PrometheusDataSource | null>(null);
    const [fetchingError] = useState<boolean>(false);

    const [server, setServer] = useState<string>(servers[0].url);
    const prevUrl = usePrevious(dataSource && dataSource.url);

    const [start, setStart] = useState<number>(moment().subtract(1, 'week').unix());
    const [end, setEnd] = useState<number | undefined>(undefined);
    const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
    const [step, setStep] = useState<number>(120);
    const [query, setQuery] = useState<string>('pegel_online_wsv_sensors{station="DRESDEN", type="waterlevel"}/100');

    const fetchData = async (d: PrometheusDataSource) => {
        const ds = new PrometheusDataSource(d.toObject());
        await ds.loadData();
        setDatasource(ds);
    };

    useEffect(() => {
        if (props.dataSource === undefined) {
            return setDatasource(PrometheusDataSource.fromObject({
                id: uuid.v4(),
                protocol: 'https',
                hostname: server,
                query,
                start,
                end,
                step
            }));
        }

        const ds = PrometheusDataSource.fromObject(props.dataSource.toObject());
        if (!ds.data) {
            fetchData(ds).then();
        }

        setServer(ds.hostname);
        setStart(ds.start);
        setEnd(ds.end);
        setAutoUpdate(!ds.end);
        setStep(ds.step);
        setQuery(ds.query);
        setDatasource(ds);
    }, []);

    useEffect(() => {
        if (dataSource && dataSource.url.toString() !== prevUrl) {
            dataSource.data = undefined;
            fetchData(dataSource);
        }
    }, [dataSource]);

    const handleSave = () => {
        if (dataSource) {
            props.onSave(dataSource);
        }
    };

    const handleGenericChange = (f: (v: any) => void) => (e: any, d: any) => {

        if (d && d.hasOwnProperty('value')) {
            return f(d.value);
        }

        if (d && d.hasOwnProperty('checked')) {
            return f(d.checked);
        }

        return f(e.target.value);
    };

    const handleAutoUpdateClick = () => {

        if (!(dataSource instanceof PrometheusDataSource)) {
            return;
        }

        const ds = PrometheusDataSource.fromObject(dataSource.toObject());

        if (autoUpdate) {
            // Switch to fixed end date
            setEnd(moment.utc().unix());
            setAutoUpdate(false);
            ds.end = moment.utc().unix();
            return setDatasource(PrometheusDataSource.fromObject(ds.toObject()));
        }

        // Switch to live end date
        setEnd(undefined);
        setAutoUpdate(true);
        ds.end = undefined;
        return setDatasource(PrometheusDataSource.fromObject(ds.toObject()));
    };

    const handleChangeServer = (e: any, d: any) => {
        if (!(dataSource instanceof PrometheusDataSource)) {
            return;
        }

        dataSource.hostname = d.value;
        setServer(d.value);
    };

    const handleBlur = (param: string) => () => {
        if (!(dataSource instanceof PrometheusDataSource)) {
            return;
        }

        const ds = PrometheusDataSource.fromObject(dataSource.toObject());

        if (param === 'start') {
            ds.start = start;
        }

        if (param === 'end') {
            ds.end = end;
        }

        if (param === 'step') {
            ds.step = step;
        }

        if (param === 'query') {
            ds.query = query;
        }

        setDatasource(PrometheusDataSource.fromObject(ds.toObject()));
    };

    const adding = () => !(props.dataSource instanceof PrometheusDataSource);

    const formatDateTimeTicks = (dt: number) => {
        return moment.unix(dt).format('YYYY/MM/DD');
    };

    // tslint:disable-next-line:variable-name
    const RenderNoShape = () => null;

    const renderDiagram = () => {
        if (!(dataSource instanceof PrometheusDataSource)) {
            return (
                <Header as={'h2'}>No data</Header>
            );
        }

        const {data} = dataSource;
        if (!data) {
            return;
        }

        const downSampledDataLTOB: DataPoint[] = LTOB(data.map((d) => ({
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
                    <YAxis dataKey={'y'} name={''} domain={['auto', 'auto']}/>
                    <Scatter
                        data={downSampledDataLTOB}
                        line={{stroke: '#1eb1ed', strokeWidth: 2}}
                        lineType={'joint'}
                        name={''}
                        shape={<RenderNoShape/>}
                    />
                </ScatterChart>
            </ResponsiveContainer>
        );
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
                                        width={6}
                                        name={'server'}
                                        selection={true}
                                        value={dataSource && dataSource.hostname || server || undefined}
                                        onChange={handleChangeServer}
                                        options={servers.map((s) => ({key: s.url, value: s.url, text: s.url}))}
                                    />
                                </Segment>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>

                    {dataSource &&
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Segment raised={true}>
                                <Label as={'div'} color={'blue'} ribbon={true}>Time range</Label>
                                <Form>
                                    <Form.Group>
                                        <Form.Input
                                            label={'Start'}
                                            type={'date'}
                                            value={start && moment.unix(start).format('YYYY-MM-DD')}
                                            onChange={handleGenericChange((d) => setStart(moment.utc(d).unix()))}
                                            onBlur={handleBlur('start')}
                                        />
                                        <Form.Input
                                            label={'Step size'}
                                            type={'number'}
                                            value={step}
                                            onChange={handleGenericChange((d) => setStep(d))}
                                            onBlur={handleBlur('step')}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Input
                                            disabled={autoUpdate}
                                            label={'End'}
                                            type={'date'}
                                            value={end ? moment.unix(end).format('YYYY-MM-DD')
                                                : moment.utc().format('YYYY-MM-DD')}
                                            onChange={handleGenericChange((d) => setEnd(moment.utc(d).unix()))}
                                            onBlur={handleBlur('end')}
                                        />
                                        <Form.Group grouped={true}>
                                            <label>Auto update</label>
                                            <Form.Checkbox
                                                checked={autoUpdate}
                                                onChange={handleAutoUpdateClick}
                                            />
                                        </Form.Group>
                                    </Form.Group>
                                </Form>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Segment raised={true}>
                                <Label as={'div'} color={'blue'} ribbon={true}>Query</Label>
                                <Form>
                                    <TextArea
                                        label={'Query'}
                                        value={query}
                                        onChange={handleGenericChange((d) => setQuery(d))}
                                        onBlur={handleBlur('query')}
                                    />
                                </Form>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    }

                    {dataSource && !dataSource.error &&
                    <Grid.Row>
                        <Grid.Column>
                            <Segment loading={!dataSource.data} raised={true}>
                                <Label as={'div'} color={'red'} ribbon={true}>Data</Label>
                                {renderDiagram()}
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    }

                    {dataSource && dataSource.error &&
                    <Grid.Row>
                        <Grid.Column>
                            <Segment raised={true}>
                                <Label as={'div'} color={'red'} ribbon={true}>Error</Label>
                                {dataSource.error}
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    }

                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Button negative={true} onClick={props.onCancel}>Cancel</Button>
                <Button
                    positive={true}
                    onClick={handleSave}
                    disabled={!dataSource || dataSource && !!dataSource.error}
                >
                    Apply
                </Button>
            </Modal.Actions>
        </Modal>
    );

};

export default PrometheusDatasourceEditor;
