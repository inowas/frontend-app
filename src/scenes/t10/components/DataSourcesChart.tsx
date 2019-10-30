import {LTOB} from 'downsample';
import {DataPoint} from 'downsample/dist/types';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import {DataSourceCollection} from '../../../core/model/rtm';
import {IDateTimeValue} from '../../../core/model/rtm/Sensor.type';

interface IProps {
    dataSources: DataSourceCollection;
}

const dataSourcesChart = (props: IProps) => {

    const [data, setData] = useState<IDateTimeValue[] | null>(null);

    useEffect(() => {
        props.dataSources.mergedData().then((d) => setData(d));
    }, [props.dataSources]);

    const formatDateTimeTicks = (dt: number) => {
        return moment.unix(dt).format('YYYY/MM/DD');
    };

    // tslint:disable-next-line:variable-name
    const RenderNoShape = () => null;

    if (!data || data.length === 0) {
        return null;
    }

    const downSampledDataLTOB: DataPoint[] = LTOB(data.map((ds) => ({
        x: ds.timeStamp,
        y: ds.value
    })), 500);

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
                <YAxis dataKey={'y'} name={''} domain={['auto', 'auto']}/>

                <Scatter
                    data={downSampledDataLTOB}
                    line={{strokeWidth: 2, stroke: '#3498DB'}}
                    lineType={'joint'}
                    name={'p'}
                    shape={<RenderNoShape/>}
                />);
            </ScatterChart>
        </ResponsiveContainer>
    );
};

export default dataSourcesChart;
