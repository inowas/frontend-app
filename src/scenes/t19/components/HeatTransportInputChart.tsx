import {IDateTimeValue} from '../../../core/model/rtm/Sensor.type';
import {IHeatTransportInput} from '../../../core/model/htm/Htm.type';
import {LTOB} from 'downsample';
import {ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import {Segment} from 'semantic-ui-react';
import React from 'react';
import moment from 'moment';

interface IProps {
    data?: IHeatTransportInput['data'],
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

    const {tempTime, timesteps} = props;

    const formatDateTimeTicks = (dt: number) => {
        return moment.unix(dt).format('YYYY-MM-DD');
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
