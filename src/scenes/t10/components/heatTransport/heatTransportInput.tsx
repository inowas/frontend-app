import {LTOB} from 'downsample';
import moment from 'moment';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import {ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import {
    Dimmer,
    DropdownItemProps,
    DropdownProps,
    Form,
    Grid,
    GridColumn,
    Loader,
    Segment
} from 'semantic-ui-react';
import {DataSourceCollection, Rtm} from '../../../../core/model/rtm';
import {ProcessingCollection} from '../../../../core/model/rtm/processing';
import {IDateTimeValue, ISensor, ISensorParameter} from '../../../../core/model/rtm/Sensor.type';
import {makeTimeProcessingRequest} from '../../../../services/api';
import {TimeSlider} from '../visualization';

interface IProps {
    label: string;
    name: string;
    onChange: (name: string, value: IDateTimeValue[]) => void;
    readOnly: boolean;
    rtm: Rtm;
}

const heatTransportInput = (props: IProps) => {
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const [sensor, setSensor] = useState<ISensor>();
    const [parameter, setParameter] = useState<ISensorParameter>();

    const [data, setData] = useState<IDateTimeValue[]>();
    const [sensorData, setSensorData] = useState<IDateTimeValue[]>();

    const [tempTime, setTempTime] = useState<[number, number]>();       // KEY
    const [timePeriod, setTimePeriod] = useState<[number, number]>();   // UNIX
    const [timesteps, setTimesteps] = useState<number[]>();             // UNIX[]

    useEffect(() => {
        if (parameter) {
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
                            setSensorData(sd);
                            setTimesteps(ts);
                            setTempTime([0, ts.length - 1]);
                            setTimePeriod([ts[0], ts[ts.length - 1]]);
                            setData(sd);
                            props.onChange(props.name, sd);
                        }
                        setIsFetching(false);
                    });
                });
            });
        }
    }, [parameter]);

    const processData = (d: IDateTimeValue[], tp: [number, number] | undefined) => {
        const cData = !tp ? d : d.filter((row) => row.timeStamp >= tp[0] && row.timeStamp <= tp[1]);
        setData(cData);
        props.onChange(props.name, cData);
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

    const handleChangeSensor = (e: SyntheticEvent<HTMLElement, Event>, {value}: DropdownProps) => {
        if (typeof value !== 'string') {
            return null;
        }
        const s = sensorsWithTemperature.filter((swt) => swt.id === value);
        if (s.length > 0) {
            const param = s[0].parameters.all.filter((p) => p.type === 't');
            if (param.length > 0) {
                setParameter(param[0]);
                return setSensor(s[0].toObject());
            }
        }
    };

    const handleChangeTimeSlider = () => {
        if (!timesteps || !tempTime) {
            return null;
        }
        const tp: [number, number] = [timesteps[tempTime[0]], timesteps[tempTime[1]]];
        setTimePeriod(tp);
        if (sensorData) {
            processData(sensorData, tp);
        }
    };

    const handleMoveTimeSlider = (ts: [number, number]) => setTempTime(ts);

    const renderChart = () => {
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
                    {timePeriod &&
                    <ReferenceLine
                        x={timePeriod[0]}
                        stroke="#000"
                        strokeDasharray="3 3"
                    />
                    }
                    {timePeriod &&
                    <ReferenceLine
                        x={timePeriod[1]}
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
        <Segment color={'grey'}>
            <Dimmer active={isFetching} inverted={true}>
                <Loader inverted={true}>Loading</Loader>
            </Dimmer>
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <Form.Select
                            disabled={props.readOnly}
                            label={props.label}
                            placeholder={props.label}
                            fluid={true}
                            selection={true}
                            value={sensor ? sensor.id : undefined}
                            options={sensorOptions}
                            onChange={handleChangeSensor}
                        />
                    </Grid.Column>
                </Grid.Row>
                {data &&
                <Grid.Row>
                    <Grid.Column>
                        {data && renderChart()}
                    </Grid.Column>
                </Grid.Row>
                }
                {timesteps &&
                <React.Fragment>
                    <Grid.Row>
                        <GridColumn width={2}/>
                        <Grid.Column width={14}>
                            <TimeSlider
                                onChange={handleChangeTimeSlider}
                                onMove={handleMoveTimeSlider}
                                timeSteps={timesteps}
                                format="YYYY-MM-DD"
                                readOnly={props.readOnly}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </React.Fragment>
                }
            </Grid>
        </Segment>
    );
};

export default heatTransportInput;
