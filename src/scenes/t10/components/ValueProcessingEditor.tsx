import {Button, DropdownProps, Form, Grid, Header, InputOnChangeData, Label, Modal, Segment} from 'semantic-ui-react';
import {DataPoint} from 'downsample';
import {DatePicker} from '../../shared/uiComponents';
import {IDatePickerProps} from '../../shared/uiComponents/DatePicker';
import {IDateTimeValue} from '../../../core/model/rtm/monitoring/Sensor.type';
import {IValueProcessingOperator} from '../../../core/model/rtm/processing/Processing.type';
import {LTOB} from 'downsample';
import {ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import {cloneDeep} from 'lodash';
import DataSourceCollection from '../../../core/model/rtm/monitoring/DataSourceCollection';
import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from 'react';
import ValueProcessing, {operators} from '../../../core/model/rtm/processing/ValueProcessing';
import moment from 'moment';
import uuid from 'uuid';

interface IProps {
    dsc: DataSourceCollection;
    processing?: ValueProcessing;
    onSave: (p: ValueProcessing) => void;
    onCancel: () => void;
}

const ValueProcessingEditor = (props: IProps) => {
    const [activeInput, setActiveInput] = useState<string>();
    const [activeValue, setActiveValue] = useState<string>('');

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

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        setActiveInput(name);
        setActiveValue(value)
    };

    const handleInputBlur = () => {
        if (activeInput === 'value') {
            setValue(parseFloat(activeValue));
        }
        setActiveInput(undefined);
    };

    const handleChangeOperator = (e: SyntheticEvent<HTMLElement, Event>, d: DropdownProps) => {
        setOperator(d.value as IValueProcessingOperator);
    };

    const handleBlurDate = (e: SyntheticEvent<Element, Event>, p: IDatePickerProps) => {
        if (!p.value) {
            return;
        }

        const value = moment(p.value.toDateString()).unix();
        if (p.name === 'start') {
            setBegin(value < end ? value : begin);
        }
        if (p.name === 'end') {
            setEnd(value > begin ? value : end);
        }
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

        const downSampledDataLTOB: DataPoint[] = LTOB(processedData.filter(
            (d) => d.value !== null
        ).map((d) => ({
            x: d.timeStamp,
            y: d.value
        })), 200) as DataPoint[];

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
                    <React.Fragment>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Segment raised={true}>
                                    <Label as={'div'} color={'blue'} ribbon={true}>Time range</Label>
                                    <Form>
                                        <Form.Group widths={'equal'}>
                                            <DatePicker
                                                onChange={handleBlurDate}
                                                label={'Start'}
                                                name="start"
                                                value={isNaN(begin) ? moment.unix(0).toDate() : moment.unix(begin).toDate()}
                                                size={'small'}
                                            />
                                            <DatePicker
                                                onChange={handleBlurDate}
                                                label={'End'}
                                                name="end"
                                                value={isNaN(end) ? moment.utc().toDate() : moment.unix(end).toDate()}
                                                size={'small'}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Segment raised={true}>
                                    <Label as={'div'} color={'blue'} ribbon={true}>Value processing</Label>
                                    <Form>
                                        <Form.Group widths={'equal'}>
                                            <Form.Select
                                                fluid={true}
                                                label={'Method'}
                                                options={operators.map((o) => ({key: o, value: o, text: o}))}
                                                value={operator}
                                                onChange={handleChangeOperator}
                                            />
                                            <Form.Input
                                                fluid={true}
                                                label={'Value'}
                                                type={'number'}
                                                name="value"
                                                value={activeInput === 'value' ? activeValue : value}
                                                onChange={handleInputChange}
                                                onBlur={handleInputBlur}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </React.Fragment>
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

export default ValueProcessingEditor;
