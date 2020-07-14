import {LTOB} from 'downsample';
import moment from 'moment';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import {ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import {Dimmer, DropdownItemProps, DropdownProps, Form, Grid, Loader, Segment} from 'semantic-ui-react';
import {DataSourceCollection, Rtm} from '../../../../core/model/rtm';
import {IDateTimeValue, ISensor, ISensorParameter} from '../../../../core/model/rtm/Sensor.type';
import { TimeSlider } from '../Visualization';

interface IProps {
    rtm: Rtm;
}

const heatTransfer = (props: IProps) => {
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const [sensorIn, setSensorIn] = useState<ISensor>();
    const [sensorOut, setSensorOut] = useState<ISensor>();

    const [parameterIn, setParameterIn] = useState<ISensorParameter>();
    const [parameterOut, setParameterOut] = useState<ISensorParameter>();

    const [sensorInData, setSensorInData] = useState<IDateTimeValue[]>();
    const [sensorOutData, setSensorOutData] = useState<IDateTimeValue[]>();

    useEffect(() => {
        if (parameterIn) {
            setData(parameterIn, setSensorInData);
        }
    }, [parameterIn]);

    useEffect(() => {
        if (parameterOut) {
            setData(parameterOut, setSensorOutData);
        }
    }, [parameterOut]);

    const setData = (param: ISensorParameter, setter: (d: IDateTimeValue[]) => void) => {
        setIsFetching(true);
        const dataSourceCollection = DataSourceCollection.fromObject(param.dataSources);
        dataSourceCollection.mergedData().then((res) => {
            if (res.length > 0) {
                setter(res);
            }
            setIsFetching(false);
        });
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

    const handleChangeSensor = (e: SyntheticEvent<HTMLElement, Event>, {name, value}: DropdownProps) => {
        if (typeof value !== 'string') {
            return null;
        }
        const sensor = sensorsWithTemperature.filter((s) => s.id === value);
        if (sensor.length > 0) {
            const param = sensor[0].parameters.all.filter((p) => p.type === 't');
            if (param.length > 0) {
                if (name === 'sensorIn') {
                    setParameterIn(param[0]);
                    return setSensorIn(sensor[0].toObject());
                }
                if (name === 'sensorOut') {
                    setParameterOut(param[0]);
                    return setSensorOut(sensor[0].toObject());
                }
            }
        }
    };

    const formatDateTimeTicks = (dt: number) => {
        return moment.unix(dt).format('YYYY/MM/DD');
    };

    const downSampledDataLTOB = (data: IDateTimeValue[]) => data ? LTOB(data.map((ds) => ({
        x: ds.timeStamp,
        y: ds.value
    })), 500) : [];

    // tslint:disable-next-line:variable-name
    const RenderNoShape = () => null;

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
                    <Scatter
                        data={downSampledDataLTOB(data)}
                        line={{strokeWidth: 2, stroke: '#3498DB'}}
                        lineType={'joint'}
                        name={'p'}
                        shape={<RenderNoShape/>}
                    />
                </ScatterChart>
            </ResponsiveContainer>
        );
    };

    return (
        <Segment color={'grey'}>
            <Dimmer active={isFetching} inverted={true}>
                <Loader inverted={true}>Loading</Loader>
            </Dimmer>
            <Form>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Form.Select
                                name="sensorIn"
                                label="Surface water"
                                placeholder="Surface water"
                                fluid={true}
                                selection={true}
                                value={sensorIn ? sensorIn.id : undefined}
                                options={sensorOptions}
                                onChange={handleChangeSensor}
                            />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Form.Select
                                name="sensorOut"
                                label="Groundwater"
                                placeholder="Groundwater"
                                fluid={true}
                                selection={true}
                                value={sensorOut ? sensorOut.id : undefined}
                                options={sensorOptions}
                                onChange={handleChangeSensor}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            {sensorInData && renderChart(sensorInData)}
                        </Grid.Column>
                        <Grid.Column width={8}>
                            {sensorOutData && renderChart(sensorOutData)}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <TimeSlider
                            onChange={() => null}
                            onMove={() => null}
                            timeSteps={[]}
                        />
                    </Grid.Row>
                </Grid>
            </Form>
        </Segment>
    );
};

export default heatTransfer;
