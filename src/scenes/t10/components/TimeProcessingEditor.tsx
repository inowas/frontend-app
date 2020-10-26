import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import {Button, DropdownProps, Form, Grid, Header, InputOnChangeData, Label, Modal, Segment} from 'semantic-ui-react';
import {DataPoint} from 'downsample';
import {DataSourceCollection} from '../../../core/model/rtm';
import {DatePicker} from '../../shared/uiComponents';
import {IDateTimeValue} from '../../../core/model/rtm/Sensor.type';
import {LTOB} from 'downsample';
import {ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import {cloneDeep} from 'lodash';
import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from 'react';
import TimeProcessing, {methods} from '../../../core/model/rtm/processing/TimeProcessing';
import moment from 'moment';
import uuid from 'uuid';

interface IProps {
    dsc: DataSourceCollection;
    processing?: TimeProcessing;
    onSave: (p: TimeProcessing) => void;
    onCancel: () => void;
}

const TimeProcessingEditor = (props: IProps) => {

    const [processing, setProcessing] = useState<TimeProcessing | null>(null);

    const [processedData, setProcessedData] = useState<IDateTimeValue[] | null>(null);
    const [begin, setBegin] = useState<number>(moment().subtract(1, 'week').unix());
    const [end, setEnd] = useState<number>(moment().unix());
    const [error, setError] = useState<any | null>(null);

    // RULES: 1d, 1w, 1y, 2w, 2d, ...
    const [rule, setRule] = useState<string>('1d');

    // METHODS: time, cubic, ...
    const [method, setMethod] = useState<string>('time');

    useEffect(() => {
        if (props.processing === undefined) {
            props.dsc.mergedData().then((rawData) => {
                if (!rawData) {
                    return;
                }

                setBegin(rawData[0].timeStamp);
                setEnd(rawData[rawData.length - 1].timeStamp);
            });

            return setProcessing(TimeProcessing.fromObject({
                id: uuid.v4(),
                type: 'time',
                begin,
                end,
                rule,
                method
            }));
        }

        const p = TimeProcessing.fromObject(props.processing.toObject());
        setBegin(p.begin);
        setEnd(p.end);
        setMethod(p.method);
        setRule(p.rule);
        setProcessing(p);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (processing) {
            process(processing, props.dsc);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processing]);

    useEffect(() => {

        if (isNaN(begin)) {
            props.dsc.mergedData().then((rawData) => {
                if (!rawData) {
                    return;
                }

                setBegin(rawData[0].timeStamp);
                return handleBlur();
            });
        }

        if (isNaN(end)) {
            props.dsc.mergedData().then((rawData) => {
                if (!rawData) {
                    return;
                }

                setEnd(rawData[rawData.length - 1].timeStamp);
                return handleBlur();
            });
        }

        return handleBlur();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [begin, end, method, rule]);

    const handleSave = () => {
        if (processing) {
            props.onSave(processing);
        }
    };

    const process = (p: TimeProcessing, dsc: DataSourceCollection) => {
        dsc.mergedData().then((rd) => {
            p.apply(cloneDeep(rd))
                .then((d) => {
                    setError(null);
                    setProcessedData(d);
                })
                .catch((e) => {
                    setError(e);
                });
        });
    };

    const handleChangeMethod = (e: SyntheticEvent<HTMLElement, Event>, d: DropdownProps) => {
        setMethod(d.value as string);
    };

    const handleChangeRule = (e: ChangeEvent<HTMLInputElement>, d: InputOnChangeData) => {
        return setRule(d.value);
    };

    const handleBlur = () => {
        console.log('HANDLEBLUR');
        if (!(processing instanceof TimeProcessing)) {
            return;
        }

        const p = TimeProcessing.fromObject(processing.toObject());
        p.begin = begin;
        p.end = end;
        p.rule = rule;
        p.method = method;
        setProcessing(TimeProcessing.fromObject(p.toObject()));
    };

    const adding = () => !(props.processing instanceof TimeProcessing);

    const formatDateTimeTicks = (dt: number) => {
        return moment.unix(dt).format('YYYY/MM/DD');
    };

    // tslint:disable-next-line:variable-name
    const RenderNoShape = () => null;

    const renderDiagram = () => {

        if (!processedData) {
            return (
                <Header as={'h2'}>No data</Header>
            );
        }

        const downSampledDataLTOB: DataPoint[] = LTOB(processedData.map((d) => ({
            x: d.timeStamp,
            y: d.value
        })), 200);

        return (
            <ResponsiveContainer height={300}>
                <ScatterChart>
                    <XAxis
                        dataKey={'x'}
                        domain={[
                            processedData.length > 0 ? processedData[0].timeStamp : 'auto',
                            processedData.length > 0 ? processedData[processedData.length - 1].timeStamp : 'auto'
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
            {adding() && <Modal.Header>Add Time Processing</Modal.Header>}
            {!adding() && <Modal.Header>Edit Time Processing</Modal.Header>}
            <Modal.Content>
                <Grid padded={true}>
                    {processedData &&
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Segment raised={true}>
                                <Label as={'div'} color={'blue'} ribbon={true}>Time range</Label>
                                <Form>
                                    <Form.Group widths={'equal'}>
                                        <DatePicker
                                            onBlur={handleBlur}
                                            label={'Start'}
                                            value={isNaN(begin) ? moment.unix(0).toDate() : moment.unix(begin).toDate()}
                                            size={'small'}
                                        />
                                        <DatePicker
                                            onBlur={handleBlur}
                                            label={'End'}
                                            value={isNaN(end) ? moment.utc().toDate() : moment.unix(end).toDate()}
                                            size={'small'}
                                        />
                                    </Form.Group>
                                </Form>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Segment raised={true}>
                                <Label as={'div'} color={'blue'} ribbon={true}>Time processing</Label>
                                <Form>
                                    <Form.Group widths={'equal'}>
                                        <Form.Select
                                            fluid={true}
                                            label={'Method'}
                                            options={methods.map((o) => ({key: o[0], value: o[0], text: o[0]}))}
                                            value={method}
                                            onChange={handleChangeMethod}
                                        />
                                        <Form.Input
                                            fluid={true}
                                            error={!!error}
                                            label={'Rule'}
                                            value={rule}
                                            onChange={handleChangeRule}
                                            onBlur={handleBlur}
                                        />
                                    </Form.Group>
                                </Form>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    }

                    {processedData &&
                    <Grid.Row>
                        <Grid.Column>
                            <Segment loading={!processedData} raised={true}>
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

export default TimeProcessingEditor;
