import {LTOB} from 'downsample';
import {DataPoint} from 'downsample/dist/types';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import {Button, Form, Grid, Header, Label, Modal, Segment, TextArea} from 'semantic-ui-react';
import uuid from 'uuid';
import DataSourceCollection from '../../../core/model/rtm/DataSourceCollection';
import {IValueProcessingComparator} from '../../../core/model/rtm/processing/Processing.type';
import ValueProcessing from '../../../core/model/rtm/processing/ValueProcessing';
import {IDateTimeValue} from '../../../core/model/rtm/Sensor.type';

interface IProps {
    dsc: DataSourceCollection;
    processing?: ValueProcessing;
    onSave: (p: ValueProcessing) => void;
    onCancel: () => void;
}

const valueProcessingEditor = (props: IProps) => {

    const [processing, setProcessing] = useState<ValueProcessing | null>(null);

    const [rawData, setRawData] = useState<IDateTimeValue[] | null>(null);
    const [begin, setBegin] = useState<number>(moment().subtract(1, 'week').unix());
    const [end, setEnd] = useState<number>(moment().unix());
    const [value, setValue] = useState<number>(0);
    const [comparator, setComparator] = useState<IValueProcessingComparator>('lte');

    useEffect(() => {

        props.dsc.mergedData().then((d) => setRawData(d));

        if (props.processing === undefined) {
            return setProcessing(ValueProcessing.fromObject({
                id: uuid.v4(),
                type: 'value',
                begin,
                end,
                comparator,
                value
            }));
        }

        const p = ValueProcessing.fromObject(props.processing.toObject());
        setBegin(p.begin);
        setEnd(p.end);
        setComparator(p.comparator);
        setValue(p.value);
        setProcessing(p);
    }, []);

    const handleSave = () => {
        if (processing) {
            props.onSave(processing);
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

    const handleBlur = (param: string) => () => {
        if (!(processing instanceof ValueProcessing)) {
            return;
        }

        const p = ValueProcessing.fromObject(processing.toObject());

        if (param === 'begin') {
            p.begin = begin;
        }

        if (param === 'end') {
            p.end = end;
        }

        if (param === 'value') {
            p.value = value;
        }

        if (param === 'comparator') {
            p.comparator = comparator;
        }

        setProcessing(ValueProcessing.fromObject(p.toObject()));
    };

    const adding = () => !(props.processing instanceof ValueProcessing);

    const formatDateTimeTicks = (dt: number) => {
        return moment.unix(dt).format('YYYY/MM/DD');
    };

    // tslint:disable-next-line:variable-name
    const RenderNoShape = () => null;

    const renderDiagram = () => {

        if (!rawData) {
            return (
                <Header as={'h2'}>No data</Header>
            );
        }

        const downSampledDataLTOB: DataPoint[] = LTOB(rawData.map((d) => ({
            x: d.timeStamp,
            y: d.value
        })), 200);

        return (
            <ResponsiveContainer height={300}>
                <ScatterChart>
                    <XAxis
                        dataKey={'x'}
                        domain={[
                            rawData.length > 0 ? rawData[0].timeStamp : 'auto',
                            rawData.length > 0 ? rawData[rawData.length - 1].timeStamp : 'auto'
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
                    {rawData &&
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Segment raised={true}>
                                <Label as={'div'} color={'blue'} ribbon={true}>Time range</Label>
                                <Form>
                                    <Form.Group>
                                        <Form.Input
                                            label={'Start'}
                                            type={'date'}
                                            value={begin && moment.unix(begin).format('YYYY-MM-DD')}
                                            onChange={handleGenericChange((d) => setBegin(moment.utc(d).unix()))}
                                            onBlur={handleBlur('start')}
                                        />
                                        <Form.Input
                                            label={'Step size'}
                                            type={'number'}
                                            value={value}
                                            onChange={handleGenericChange((d) => setValue(d))}
                                            onBlur={handleBlur('step')}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Input
                                            label={'End'}
                                            type={'date'}
                                            value={end && moment.unix(end).format('YYYY-MM-DD')}
                                            onChange={handleGenericChange((d) => setEnd(moment.utc(d).unix()))}
                                            onBlur={handleBlur('end')}
                                        />
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
                                        value={comparator}
                                        onChange={handleGenericChange((d) => setComparator(d))}
                                        onBlur={handleBlur('comparator')}
                                    />
                                </Form>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    }

                    {rawData &&
                    <Grid.Row>
                        <Grid.Column>
                            <Segment loading={!rawData} raised={true}>
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
