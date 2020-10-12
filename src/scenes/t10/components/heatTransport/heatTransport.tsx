import {LTOB} from 'downsample';
import _ from 'lodash';
import moment from 'moment';
import React, {FormEvent, SyntheticEvent, useEffect, useState} from 'react';
import {ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import {
    Button,
    Dimmer,
    DropdownItemProps,
    DropdownProps,
    Form,
    Grid,
    InputOnChangeData,
    Loader,
    Popup,
    Segment
} from 'semantic-ui-react';
import Uuid from 'uuid';
import {DataSourceCollection, Rtm} from '../../../../core/model/rtm';
import {ProcessingCollection} from '../../../../core/model/rtm/processing';
import {IDateTimeValue, ISensor, ISensorParameter} from '../../../../core/model/rtm/Sensor.type';
import {makeHeatTransportRequest, makeTimeProcessingRequest} from '../../../../services/api';
import {TimeSlider} from '../visualization';
import {HeatTransportResults} from './index';
import {IHeatTransportRequest, IHeatTransportRequestOptions, IHeatTransportResults} from './types';

interface IProps {
    rtm: Rtm;
}

const heatTransport = (props: IProps) => {
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const [sensorSw, setSensorSw] = useState<ISensor>();
    const [sensorGw, setSensorGw] = useState<ISensor>();

    const [parameterSw, setParameterSw] = useState<ISensorParameter>();
    const [parameterGw, setParameterGw] = useState<ISensorParameter>();

    const [sensorSwData, setSensorSwData] = useState<IDateTimeValue[]>();
    const [sensorGwData, setSensorGwData] = useState<IDateTimeValue[]>();

    const [swData, setSwData] = useState<IDateTimeValue[]>();
    const [gwData, setGwData] = useState<IDateTimeValue[]>();

    const [tempTime, setTempTime] = useState<[number, number]>();
    const [timePeriod, setTimePeriod] = useState<[number, number]>();
    const [timesteps, setTimesteps] = useState<number[]>();
    const [timeSlideId, setTimeSliderId] = useState<string>(Uuid.v4());

    const [results, setResults] = useState<IHeatTransportResults>();

    const [activeInput, setActiveInput] = useState<string>();
    const [activeValue, setActiveValue] = useState<string>('');

    const [requestOptions, setRequestOptions] = useState<IHeatTransportRequestOptions>({
        retardation_factor: 1.8,
        sw_monitoring_id: 'TEGsee-mikrosieb',
        gw_monitoring_id: 'TEG343',
        limits: [100, 500],
        tolerance: 0.001,
        debug: false
    });

    useEffect(() => {
        if (parameterSw) {
            setData(parameterSw, setSensorSwData);
        }
    }, [parameterSw]);

    useEffect(() => {
        if (parameterGw) {
            setData(parameterGw, setSensorGwData);
        }
    }, [parameterGw]);

    useEffect(() => {
        if (sensorSwData && sensorGwData) {
            const ts = sensorSwData.map((t) => t.timeStamp)
                .concat(sensorGwData.map((t) => t.timeStamp));
            const fTs = _.orderBy(_.uniq(ts));
            setTimesteps(fTs);
            setTempTime([0, fTs.length - 1]);
            setTimePeriod([0, fTs.length - 1]);
            setSwData(sensorSwData);
            setGwData((sensorGwData));
        }
    }, [sensorSwData, sensorGwData]);

    const setData = (param: ISensorParameter, setter: (d: IDateTimeValue[]) => void) => {
        setIsFetching(true);
        const dataSourceCollection = DataSourceCollection.fromObject(param.dataSources);
        dataSourceCollection.mergedData().then((res) => {
            const processed = ProcessingCollection.fromObject(param.processings);
            processed.apply(res).then((r) => {
                if (r.length > 0) {
                    setter(r);
                }
                setIsFetching(false);
            });
        });
    };

    const processData = (data1: IDateTimeValue[], data2: IDateTimeValue[], ts: [number, number] | undefined) => {
        if (!ts) {
            setSwData(data1);
            setGwData(data2);
            return;
        }
        setSwData(data1.filter((row) => row.timeStamp >= ts[0] && row.timeStamp <= ts[1]));
        setGwData(data2.filter((row) => row.timeStamp >= ts[0] && row.timeStamp <= ts[1]));
    };

    const sensorsWithTemperature = props.rtm.sensors.all.filter((s) =>
        s.parameters.filterBy('type', 't').length > 0
    );

    const sensorOptions: DropdownItemProps[] = sensorsWithTemperature.map((s) => {
        return {
            key: s.id,
            text: s.name,
            value: s.id
        };
    });

    const handleCalculate = async () => {
        if (!swData || !gwData) {
            return;
        }

        setIsFetching(true);
        let data1: IDateTimeValue[] = [];
        let data2: IDateTimeValue[] = [];

        const uniqueSwData = swData.filter((value, index, self) => {
            return self.findIndex((v) => v.timeStamp === value.timeStamp) === index;
        });

        const uniqueGwData = gwData.filter((value, index, self) => {
            return self.findIndex((v) => v.timeStamp === value.timeStamp) === index;
        });

        makeTimeProcessingRequest(uniqueSwData, '1d', 'cubic').then((r1: IDateTimeValue[]) => {
            data1 = r1;
            makeTimeProcessingRequest(uniqueGwData, '1d', 'cubic').then((r2: IDateTimeValue[]) => {
                data2 = r2;
                const requestData: IHeatTransportRequest = {
                    data_sw_selected: data1.map((row) => ({
                        date: moment.unix(row.timeStamp).format('YYYY-MM-DD'),
                        value: row.value
                    })),
                    data_gw_selected: data2.map((row) => ({
                        date: moment.unix(row.timeStamp).format('YYYY-MM-DD'),
                        value: row.value
                    })),
                    ...requestOptions
                };

                makeHeatTransportRequest(requestData).then((r3) => {
                    setResults(JSON.parse(r3));
                    setIsFetching(false);
                });
            });
        });
    };

    const handleClickReset = () => {
        if (!timesteps) {
            return null;
        }
        setTimePeriod([0, timesteps.length - 1]);
        setTimeSliderId(Uuid.v4());
    };

    const handleBlurInput = () => {
        if (activeInput === 'retardationFactor') {
            const parsedValue = parseFloat(activeValue);
            setRequestOptions({
                ...requestOptions,
                retardation_factor: !isNaN(parsedValue) ? parseFloat(activeValue) : 1.8
            });
        }
        if (activeInput === 'tolerance') {
            const parsedValue = parseFloat(activeValue);
            setRequestOptions({
                ...requestOptions,
                tolerance: !isNaN(parsedValue) ? parseFloat(activeValue) : 1.8
            });
        }
        setActiveInput(undefined);
    };

    const handleChangeInput = (e: FormEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        setActiveInput(name);
        setActiveValue(value);
    };

    const handleChangeSensor = (e: SyntheticEvent<HTMLElement, Event>, {name, value}: DropdownProps) => {
        if (typeof value !== 'string') {
            return null;
        }
        const sensor = sensorsWithTemperature.filter((s) => s.id === value);
        if (sensor.length > 0) {
            const param = sensor[0].parameters.all.filter((p) => p.type === 't');
            if (param.length > 0) {
                if (name === 'sensorSw') {
                    setParameterSw(param[0]);
                    return setSensorSw(sensor[0].toObject());
                }
                if (name === 'sensorGw') {
                    setParameterGw(param[0]);
                    return setSensorGw(sensor[0].toObject());
                }
            }
        }
    };

    const handleChangeTimeSlider = () => {
        setTimePeriod(tempTime);
        if (sensorSwData && sensorGwData) {
            processData(sensorSwData, sensorGwData, tempTime);
        }
    };

    const handleMoveTimeSlider = (ts: [number, number]) => {
        if (timesteps) {
            const tss: [number, number] = [timesteps[ts[0]], timesteps[ts[1]]];
            return setTempTime(tss);
        }
    };

    const formatDateTimeTicks = (dt: number) => {
        return moment.unix(dt).format('YYYY-MM-DD');
    };

    const downSampledDataLTOB = (data: IDateTimeValue[]) => data ? LTOB(data.map((ds) => ({
        x: ds.timeStamp,
        y: ds.value
    })), 500) : [];

    const RENDER_NO_SHAPE = () => null;

    const renderChart = (data: IDateTimeValue[]) => {
        return (
            <ResponsiveContainer height={300}>
                <ScatterChart>
                    <XAxis
                        dataKey={'x'}
                        domain={[data[0].timeStamp, data[data.length - 1].timeStamp]}
                        name={'Date Time'}
                        tickFormatter={formatDateTimeTicks}
                        type={'number'}
                    />
                    <YAxis
                        label={{value: 'T', angle: -90, position: 'insideLeft'}}
                        dataKey={'y'}
                        name={''}
                        domain={['auto', 'auto']}
                    />
                    {timePeriod && timesteps &&
                    <ReferenceLine
                        x={timePeriod[0]}
                        stroke="#000"
                        strokeDasharray="3 3"
                    />
                    }
                    {timePeriod && timesteps &&
                    <ReferenceLine
                        x={timePeriod[1]}
                        stroke="#000"
                        strokeDasharray="3 3"
                    />
                    }
                    <Scatter
                        data={downSampledDataLTOB(data)}
                        line={{strokeWidth: 2, stroke: '#3498DB'}}
                        lineType={'joint'}
                        name={'p'}
                        shape={<RENDER_NO_SHAPE/>}
                    />
                </ScatterChart>
            </ResponsiveContainer>
        );
    };

    return (
        <React.Fragment>
        <Segment color={'grey'}>
            <Dimmer active={isFetching} inverted={true}>
                <Loader inverted={true}>Loading</Loader>
            </Dimmer>
            <Form>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Form.Select
                                name="sensorSw"
                                label="Surface water"
                                placeholder="Surface water"
                                fluid={true}
                                selection={true}
                                value={sensorSw ? sensorSw.id : undefined}
                                options={sensorOptions}
                                onChange={handleChangeSensor}
                            />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Form.Select
                                name="sensorGw"
                                label="Groundwater"
                                placeholder="Groundwater"
                                fluid={true}
                                selection={true}
                                value={sensorGw ? sensorGw.id : undefined}
                                options={sensorOptions}
                                onChange={handleChangeSensor}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    {(sensorSwData || sensorGwData) &&
                        <Grid.Row>
                            <Grid.Column width={8}>
                                {sensorSwData && renderChart(sensorSwData)}
                            </Grid.Column>
                            <Grid.Column width={8}>
                                {sensorGwData && renderChart(sensorGwData)}
                            </Grid.Column>
                        </Grid.Row>
                    }
                    {timesteps &&
                    <Grid.Row>
                        <Grid.Column width={1}>
                            <Popup
                                content="Reset"
                                trigger={
                                    <Button
                                        onClick={handleClickReset}
                                        icon="undo"
                                        size="tiny"
                                    />
                                }
                            />
                        </Grid.Column>
                        <Grid.Column key={timeSlideId} width={15}>
                            <TimeSlider
                                onChange={handleChangeTimeSlider}
                                onMove={handleMoveTimeSlider}
                                timeSteps={timesteps}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    }
                    <Grid.Row>
                        <Grid.Column>
                            <Form.Group>
                                <Form.Input
                                    name="retardationFactor"
                                    label="Retardation Factor"
                                    type="number"
                                    onBlur={handleBlurInput}
                                    onChange={handleChangeInput}
                                    value={activeInput === 'retardationFactor' ? activeValue :
                                        requestOptions.retardation_factor}
                                />
                                <Form.Input
                                    name="tolerance"
                                    label="Tolerance"
                                    type="number"
                                    onBlur={handleBlurInput}
                                    onChange={handleChangeInput}
                                    value={activeInput === 'tolerance' ? activeValue : requestOptions.tolerance}
                                />
                                <Form.Button
                                    positive={true}
                                    fluid={true}
                                    onClick={handleCalculate}
                                    disabled={!swData || !gwData}
                                    label="&nbsp;"
                                >
                                    Run calculation
                                </Form.Button>
                            </Form.Group>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Form>
        </Segment>
            {results && <HeatTransportResults results={results} />}
        </React.Fragment>
    );
};

export default heatTransport;
