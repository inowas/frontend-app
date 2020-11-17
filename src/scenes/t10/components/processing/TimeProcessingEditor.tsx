import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import {Button, DropdownProps, Form, Grid, Header, InputOnChangeData, Label, Modal, Segment} from 'semantic-ui-react';
import {DataPoint, LTOB} from 'downsample';
import {DataSourceCollection} from '../../../../core/model/rtm';
import {DatePicker} from '../../../shared/uiComponents';
import {ECutRule} from '../../../../core/model/rtm/processing/Processing.type';
import {IDatePickerProps} from '../../../shared/uiComponents/DatePicker';
import {IDateTimeValue} from '../../../../core/model/rtm/Sensor.type';
import {ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import {cloneDeep} from 'lodash';
import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from 'react';
import TimeProcessing, {methods} from '../../../../core/model/rtm/processing/TimeProcessing';
import moment from 'moment';
import uuid from 'uuid';

interface IProps {
    dsc: DataSourceCollection;
    processing?: TimeProcessing;
    onSave: (p: TimeProcessing) => void;
    onCancel: () => void;
}

const TimeProcessingEditor = (props: IProps) => {
    const [activeInput, setActiveInput] = useState<string>();
    const [activeValue, setActiveValue] = useState<string>('');

    const [processing, setProcessing] = useState<TimeProcessing | null>(null);

    const [processedData, setProcessedData] = useState<IDateTimeValue[] | null>(null);
    const [begin, setBegin] = useState<number>(moment().subtract(1, 'week').unix());
    const [end, setEnd] = useState<number>(moment().unix());
    const [cut, setCut] = useState<ECutRule>(ECutRule.NONE);
    const [cutNumber, setCutNumber] = useState<number | undefined>();
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
                method,
                cut: ECutRule.NONE
            }));
        }

        const p = TimeProcessing.fromObject(props.processing.toObject());
        setBegin(p.begin);
        setEnd(p.end);
        setMethod(p.method);
        setRule(p.rule);
        setCut(p.cut);
        setCutNumber(p.cutNumber);
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
    }, [cut, cutNumber, begin, end, method, rule]);

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

    const handleChangeSelect = (e: SyntheticEvent<HTMLElement, Event>, d: DropdownProps) => {
        if (d.name === 'method' && typeof d.value === 'string') {
            setMethod(d.value);
        }
        if (d.name === 'cut' && typeof d.value === 'string') {
            setCut(d.value as ECutRule);
        }
    };

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        setActiveInput(name);
        setActiveValue(value);
    };

    const handleBlurInput = () => {
        if (activeInput === 'rule') {
            setRule(activeValue);
        }
        if (activeInput === 'cutNumber') {
            setCutNumber(parseFloat(activeValue));
        }

        setActiveInput(undefined);
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
        if (!(processing instanceof TimeProcessing)) {
            return;
        }

        const p = TimeProcessing.fromObject(processing.toObject());
        p.begin = begin;
        p.end = end;
        p.rule = rule;
        p.method = method;
        p.cut = cut;
        p.cutNumber = cutNumber;
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

        const downSampledDataLTOB: DataPoint[] = LTOB(processedData.filter(
            (d) => d.value !== null
        ).map((d) => ({
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
                    <React.Fragment>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Segment raised={true}>
                                    <Label as={'div'} color={'blue'} ribbon={true}>Cut</Label>
                                    <Form>
                                        <Form.Group widths={'equal'}>
                                            <Form.Select
                                                label="Rule"
                                                name="cut"
                                                onChange={handleChangeSelect}
                                                options={[
                                                    {key: ECutRule.NONE, value: ECutRule.NONE, text: 'None'},
                                                    {key: ECutRule.PERIOD, value: ECutRule.PERIOD, text: 'Period'},
                                                    {
                                                        key: ECutRule.UNTIL_TODAY,
                                                        value: ECutRule.UNTIL_TODAY,
                                                        text: 'From date until today'
                                                    },
                                                    {
                                                        key: ECutRule.BEFORE_TODAY,
                                                        value: ECutRule.BEFORE_TODAY,
                                                        text: 'Units before today'
                                                    }
                                                ]}
                                                value={cut}
                                            />
                                            {cut === ECutRule.BEFORE_TODAY &&
                                            <Form.Input
                                                label="Number of units"
                                                name="cutNumber"
                                                value={activeInput === 'cutNumber' ? activeValue : cutNumber}
                                                type="number"
                                                onChange={handleChangeInput}
                                                onBlur={handleBlurInput}
                                            />
                                            }
                                        </Form.Group>
                                    </Form>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        {cut !== ECutRule.BEFORE_TODAY &&
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Segment raised={true}>
                                    <Label as={'div'} color={'blue'} ribbon={true}>Time range</Label>
                                    <Form>
                                        <Form.Group widths={'equal'}>
                                            <DatePicker
                                                onChange={handleBlurDate}
                                                label="Start"
                                                value={isNaN(begin) ? moment.unix(0).toDate() : moment.unix(begin).toDate()}
                                                size="small"
                                                name="start"
                                            />
                                            <DatePicker
                                                disabled={cut === ECutRule.UNTIL_TODAY}
                                                onChange={handleBlurDate}
                                                label="End"
                                                value={isNaN(end) ? moment.utc().toDate() : moment.unix(end).toDate()}
                                                size="small"
                                                name="end"
                                            />
                                        </Form.Group>
                                    </Form>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        }
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Segment raised={true}>
                                    <Label as={'div'} color={'blue'} ribbon={true}>Time resolution</Label>
                                    <Form>
                                        <Form.Group widths={'equal'}>
                                            <Form.Select
                                                fluid={true}
                                                label="Method"
                                                name="method"
                                                options={methods.map((o) => ({key: o[0], value: o[0], text: o[0]}))}
                                                value={method}
                                                onChange={handleChangeSelect}
                                            />
                                            <Form.Input
                                                fluid={true}
                                                error={!!error}
                                                name="rule"
                                                label="Rule"
                                                value={activeInput === 'rule' ? activeValue : rule}
                                                onChange={handleChangeInput}
                                                onBlur={handleBlurInput}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Segment loading={!processedData} raised={true}>
                                    <Label as={'div'} color={'red'} ribbon={true}>Data</Label>
                                    {renderDiagram()}
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </React.Fragment>
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
