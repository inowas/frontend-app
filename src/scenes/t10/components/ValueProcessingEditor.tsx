import {LTOB} from 'downsample';
import {DataPoint} from 'downsample/dist/types';
import {cloneDeep} from 'lodash';
import moment from 'moment';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import {ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import {Button, DropdownProps, Form, Grid, Header, Label, Modal, Segment} from 'semantic-ui-react';
import uuid from 'uuid';
import DataSourceCollection from '../../../core/model/rtm/DataSourceCollection';
import {IValueProcessingOperator} from '../../../core/model/rtm/processing/Processing.type';
import ValueProcessing, {operators} from '../../../core/model/rtm/processing/ValueProcessing';
import {IDateTimeValue} from '../../../core/model/rtm/Sensor.type';

interface IProps {
    dsc: DataSourceCollection;
    processing?: ValueProcessing;
    onSave: (p: ValueProcessing) => void;
    onCancel: () => void;
}

const valueProcessingEditor = (props: IProps) => {

    const [processing, setProcessing] = useState<ValueProcessing | null>(null);

    const [processedData, setProcessedData] = useState<IDateTimeValue[] | null>(null);
    const [begin, setBegin] = useState<number>(moment().subtract(1, 'week').unix());
    const [end, setEnd] = useState<number>(moment().unix());
    const [value, setValue] = useState<number>(1);
    const [operator, setOperator] = useState<IValueProcessingOperator>('*');

    useEffect(() => {

        if (props.processing === undefined) {
            props.dsc.mergedData().then((rawData) => {
                if (!rawData) {
                    return;
                }

                setBegin(rawData[0].timeStamp);
                setEnd(rawData[rawData.length - 1].timeStamp);
            });

            return setProcessing(ValueProcessing.fromObject({
                id: uuid.v4(),
                type: 'value',
                begin,
                end,
                operator,
                value
            }));
        }

        const p = ValueProcessing.fromObject(props.processing.toObject());
        setBegin(p.begin);
        setEnd(p.end);
        setOperator(p.operator);
        setValue(p.value);
        setProcessing(p);
    }, []);

    useEffect(() => {
        if (processing) {
            process(processing, props.dsc);
        }

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

    }, [operator, begin, end, value]);

    const handleSave = () => {
        if (processing) {
            props.onSave(processing);
        }
    };

    const process = (p: ValueProcessing, dsc: DataSourceCollection) => {
        dsc.mergedData().then((rd) => {
            p.apply(cloneDeep(rd)).then((d) => setProcessedData(d));
        });
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

    const handleChangeOperator = (e: SyntheticEvent<HTMLElement, Event>, d: DropdownProps) => {
        setOperator(d.value as IValueProcessingOperator);
    };

    const handleBlur = () => {
        if (!(processing instanceof ValueProcessing)) {
            return;
        }

        const p = ValueProcessing.fromObject(processing.toObject());
        p.begin = begin;
        p.end = end;
        p.value = value;
        p.operator = operator;
        setProcessing(ValueProcessing.fromObject(p.toObject()));
    };

    const adding = () => !(props.processing instanceof ValueProcessing);

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
            {adding() && <Modal.Header>Add Datasource</Modal.Header>}
            {!adding() && <Modal.Header>Edit Datasource</Modal.Header>}
            <Modal.Content>
                <Grid padded={true}>
                    {processedData &&
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Segment raised={true}>
                                <Label as={'div'} color={'blue'} ribbon={true}>Time range</Label>
                                <Form>
                                    <Form.Group>
                                        <Form.Input
                                            label={'Start'}
                                            type={'date'}
                                            value={
                                                isNaN(begin) ?
                                                    moment.unix(0).format('YYYY-MM-DD') :
                                                    moment.unix(begin).format('YYYY-MM-DD')
                                            }
                                            onChange={handleGenericChange((d) => setBegin(moment.utc(d).unix()))}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Input
                                            label={'End'}
                                            type={'date'}
                                            value={
                                                isNaN(end) ?
                                                    moment.utc().format('YYYY-MM-DD') :
                                                    moment.unix(end).format('YYYY-MM-DD')
                                            }
                                            onChange={handleGenericChange((d) => setEnd(moment.utc(d).unix()))}
                                            onBlur={handleBlur}
                                        />
                                    </Form.Group>
                                </Form>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Segment raised={true}>
                                <Label as={'div'} color={'blue'} ribbon={true}>Value processing</Label>
                                <Form>
                                    <Form.Group>
                                        <Form.Dropdown
                                            label={'Operation'}
                                            options={operators.map((o) => ({key: o, value: o, text: o}))}
                                            value={operator}
                                            onChange={handleChangeOperator}
                                        />
                                        <Form.Input
                                            label={'Value'}
                                            type={'number'}
                                            value={value}
                                            onChange={handleGenericChange((d) => setValue(parseFloat(d)))}
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

export default valueProcessingEditor;
