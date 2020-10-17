import {LTOB} from 'downsample';
import moment from 'moment';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import {ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import {
    Dimmer,
    DropdownProps,
    Form,
    Loader,
    Segment,
    Message
} from 'semantic-ui-react';
import {DataSourceCollection, Rtm} from '../../../core/model/rtm';
import {ProcessingCollection} from '../../../core/model/rtm/processing';
import {IDateTimeValue, ISensor, ISensorParameter} from '../../../core/model/rtm/Sensor.type';
import {fetchUrl, makeTimeProcessingRequest} from '../../../services/api';
import {TimeSlider} from '../../t10/components/visualization';
import {IRtm} from "../../../core/model/rtm/Rtm.type";
import {IToolInstance} from "../../dashboard/defaults/tools";
import uuid from "uuid";
import {IHeatTransportInput} from '../../../core/model/htm/Htm.type';
import HtmInput from "../../../core/model/htm/HtmInput";

interface IProps {
    input: HtmInput;
    label: string;
    name: string;
    onChange: (input: HtmInput) => void;
    readOnly: boolean;
}

interface IError {
    id: string;
    message: string;
}

const HeatTransportInput = (props: IProps) => {
    const [isFetching, setIsFetching] = useState<boolean>(true);

    const [errors, setErrors] = useState<IError[]>([]);

    const [input, setInput] = useState<IHeatTransportInput>(props.input.toObject());

    const [t10Instances, setT10Instances] = useState<IToolInstance[]>([]);
    const [rtm, setRtm] = useState<IRtm>();

    const [sensor, setSensor] = useState<ISensor>();
    const [parameter, setParameter] = useState<ISensorParameter>();

    const [recalculate, setRecalculate] = useState<boolean>(false);

    const [tempTime, setTempTime] = useState<[number, number]>();       // KEY
    const [timesteps, setTimesteps] = useState<number[]>();             // UNIX[]

    useEffect(() => {
        fetchInstances();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setInput(props.input.toObject());
    }, [props.input]);

    useEffect(() => {
        if (input.rtmId) {
            fetchRtm(input.rtmId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input.rtmId]);

    useEffect(() => {
        if (rtm && input.sensorId) {
            fetchSensor(input.sensorId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input.sensorId, rtm]);

    useEffect(() => {
        if (timesteps && input.timePeriod) {
            const startIndex = timesteps.indexOf(input.timePeriod[0]);
            const endIndex = timesteps.indexOf(input.timePeriod[1]);
            setTempTime([startIndex < 0 ? 0 : startIndex, endIndex < 0 ? timesteps.length - 1 : endIndex]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input.timePeriod]);

    useEffect(() => {
        if (input.data) {
            const ts = input.data.map((t) => t.timeStamp);
            setTimesteps(ts);
        }
    }, [input.data]);

    useEffect(() => {
        if (parameter && recalculate) {
            setIsFetching(true);
            const dataSourceCollection = DataSourceCollection.fromObject(parameter.dataSources);
            dataSourceCollection.mergedData().then((res) => {
                const processed = ProcessingCollection.fromObject(parameter.processings);
                processed.apply(res).then((r) => {
                    const uniqueData = r.filter((value, index, self) => {
                        return self.findIndex((v) => v.timeStamp === value.timeStamp) === index;
                    });
                    makeTimeProcessingRequest(uniqueData, '1d', 'cubic').then((sd: IDateTimeValue[]) => {
                        if (sd.length > 0) {
                            const ts = sd.map((t) => t.timeStamp);
                            setRecalculate(false);
                            setTimesteps(ts);
                            setTempTime([0, ts.length - 1]);
                            props.onChange(HtmInput.fromObject({
                                data: sd,
                                timePeriod: [ts[0], ts[ts.length - 1]],
                                ...input
                            }));
                        }
                        setIsFetching(false);
                    });
                });
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parameter, recalculate]);

    const fetchInstances = () => {
        setIsFetching(true);
        fetchUrl('tools/T10?public=true',
            (data) => {
                setT10Instances(data);
                setIsFetching(false);
            },
            () => {
                setErrors(errors.concat([{id: uuid.v4(), message: `Fetching t10 instances failed.`}]));
                setIsFetching(false);
            }
        );
    };

    const fetchRtm = (id: string) => {
        setIsFetching(true);
        fetchUrl(`tools/T10/${id}`,
            (m) => {
                setRtm(m);
                setIsFetching(false);
            },
            () => {
                setErrors(errors.concat([{id: uuid.v4(), message: `Fetching t10 instance ${id} failed.`}]));
                setIsFetching(false);
            }
        );
    };

    const fetchSensor = (id: string) => {
        if (!rtm) {
            return;
        }
        const s = sensorsWithTemperature(rtm).filter((swt) => swt.id === id);
        if (s.length > 0) {
            const param = s[0].parameters.all.filter((p) => p.type === 't');
            if (param.length > 0) {
                setParameter(param[0]);
                return setSensor(s[0].toObject());
            }
        }
    };

    const sensorsWithTemperature = (rtm: IRtm) => Rtm.fromObject(rtm).sensors.all.filter((s) =>
        s.parameters.filterBy('type', 't').length > 0
    );

    const getSensorOptions = () => {
        if (!rtm) {
            return [];
        }

        return sensorsWithTemperature(rtm).map((s) => {
            return {
                key: s.id,
                text: s.name,
                value: s.id
            };
        });
    };

    const handleChangeRtm = (e: SyntheticEvent<HTMLElement, Event>, {value}: DropdownProps) => {
        if (typeof value !== 'string') {
            return null;
        }
        props.onChange(HtmInput.fromObject({
            ...input,
            rtmId: value
        }));
    };

    const handleChangeSensor = (e: SyntheticEvent<HTMLElement, Event>, {value}: DropdownProps) => {
        if (typeof value !== 'string' || !rtm) {
            return null;
        }
        setRecalculate(true);
        props.onChange(HtmInput.fromObject({
            ...input,
            sensorId: value
        }));
    };

    const handleChangeTimeSlider = () => {
        if (!timesteps || !tempTime) {
            return null;
        }
        const sensorData = props.input.data;
        const tp: [number, number] = [timesteps[tempTime[0]], timesteps[tempTime[1]]];
        if (sensorData) {
            const cData = !tp ? sensorData : sensorData.filter(
                (row) => row.timeStamp >= tp[0] && row.timeStamp <= tp[1]);
            props.onChange(HtmInput.fromObject({
                data: cData,
                timePeriod: tp,
                ...input
            }));
        }
    };

    const handleDismissError = (id: string) => () => setErrors(errors.filter((e) => e.id !== id));

    const handleMoveTimeSlider = (ts: [number, number]) => setTempTime(ts);

    const renderChart = () => {
        const sensorData = input.data;
        if (!sensorData) {
            return null;
        }
        return (
            <ResponsiveContainer height={300}>
                <ScatterChart>
                    <XAxis
                        dataKey={'x'}
                        domain={[sensorData[0].timeStamp, sensorData[sensorData.length - 1].timeStamp]}
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
                    {tempTime && timesteps &&
                    <ReferenceLine
                        x={timesteps[tempTime[0]]}
                        stroke="#000"
                        strokeDasharray="3 3"
                    />
                    }
                    {tempTime && timesteps &&
                    <ReferenceLine
                        x={timesteps[tempTime[1]]}
                        stroke="#000"
                        strokeDasharray="3 3"
                    />
                    }
                    <Scatter
                        data={downSampledDataLTOB(sensorData)}
                        line={{strokeWidth: 2, stroke: '#3498DB'}}
                        lineType={'joint'}
                        name={'p'}
                        shape={<RENDER_NO_SHAPE/>}
                    />
                </ScatterChart>
            </ResponsiveContainer>
        );
    };

    const formatDateTimeTicks = (dt: number) => {
        return moment.unix(dt).format('YYYY-MM-DD');
    };

    const downSampledDataLTOB = (d: IDateTimeValue[]) => d ? LTOB(d.map((ds) => ({
        x: ds.timeStamp,
        y: ds.value
    })), 500) : [];

    const RENDER_NO_SHAPE = () => null;

    return (
        <div>
            <Segment color="grey">
                {isFetching &&
                <Dimmer active={true} inverted={true}>
                    <Loader inverted={true}>Loading</Loader>
                </Dimmer>
                }
                <h4>{props.label}</h4>
                <Form.Select
                    disabled={props.readOnly}
                    label="T10 Instance"
                    placeholder="Select instance"
                    fluid={true}
                    selection={true}
                    value={rtm ? rtm.id : undefined}
                    options={t10Instances.map((i) => ({
                        key: i.id,
                        text: i.name,
                        value: i.id
                    }))}
                    onChange={handleChangeRtm}
                />
                <Form.Select
                    disabled={props.readOnly || !rtm || rtm.data.sensors.length === 0}
                    label="Sensor"
                    placeholder="Select sensor"
                    fluid={true}
                    selection={true}
                    value={sensor ? sensor.id : undefined}
                    options={getSensorOptions()}
                    onChange={handleChangeSensor}
                />
                {props.input.data && renderChart()}
                {timesteps &&
                <TimeSlider
                    onChange={handleChangeTimeSlider}
                    onMove={handleMoveTimeSlider}
                    timeSteps={timesteps}
                    format="YYYY-MM-DD"
                    readOnly={props.readOnly}
                    value={tempTime}
                />
                }
            </Segment>
            {errors.map((error) => (
                <Message negative={true} onDismiss={handleDismissError(error.id)}>
                    <Message.Header>Error</Message.Header>
                    <p>{error.message}</p>
                </Message>
            ))}
        </div>
    );
};

export default HeatTransportInput;
