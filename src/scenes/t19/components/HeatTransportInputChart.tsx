import {IDateTimeValue} from '../../../core/model/rtm/monitoring/Sensor.type';
import {LTOB} from 'downsample';
import {ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import {Segment} from 'semantic-ui-react';
import React from 'react';
import moment from 'moment';

interface IProps {
    data: IDateTimeValue[] | null,
    dateTimeFormat: string,
    tempTime?: [number, number],
    timesteps?: number[],
    isLoading: boolean
}

const HeatTransportInputChart = (props: IProps) => {
    if (!props.data) {
        return (
            <Segment loading={props.isLoading}>
                <ResponsiveContainer height={300}>
                    <ScatterChart/>
                </ResponsiveContainer>
            </Segment>
        );
    }

    const formatDateTimeTicks = (dt: number) => {
        return moment.unix(dt).format(props.dateTimeFormat);
    };

    const formatTemperatureTicks = (t: number) => {
        return t.toFixed(2);
    };

    const downSampleData = (d: IDateTimeValue[]) => d ? LTOB(d.map((ds) => ({
        x: ds.timeStamp,
        y: ds.value
    })), 500) : [];

    const downsampledData = downSampleData(props.data);

    const RENDER_NO_SHAPE = () => null;

    return (
        <Segment loading={props.isLoading}>
            <ResponsiveContainer height={300}>
                <ScatterChart>
                    <XAxis
                        dataKey={'x'}
                        domain={[props.data[0].timeStamp, props.data[downsampledData.length - 1].timeStamp]}
                        name={'x'}
                        tickFormatter={formatDateTimeTicks}
                        type={'number'}
                    />
                    <YAxis
                        label={{value: 'T [°C]', angle: -90, position: 'insideLeft'}}
                        dataKey={'y'}
                        name={'y'}
                        tickFormatter={formatTemperatureTicks}
                        domain={['auto', 'auto']}
                    />
                    <Scatter
                        data={downsampledData}
                        line={{strokeWidth: 2, stroke: '#3498DB'}}
                        lineType={'joint'}
                        name={'p'}
                        shape={<RENDER_NO_SHAPE/>}
                    />
                </ScatterChart>
            </ResponsiveContainer>
        </Segment>
    );
};

export default React.memo(HeatTransportInputChart);
