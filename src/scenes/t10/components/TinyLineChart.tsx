import {LTOB} from 'downsample';
import {DataPoint} from 'downsample/dist/types';
import React from 'react';
import {Line, LineChart, YAxis} from 'recharts';
import {Loader} from 'semantic-ui-react';
import FileDataSource from '../../../core/model/rtm/FileDataSource';
import {IDateTimeValue} from '../../../core/model/rtm/Sensor.type';
import SensorDataSource from '../../../core/model/rtm/SensorDataSource';

interface IProps {
    datasource: SensorDataSource | FileDataSource | null;
    color?: string;
    begin?: number;
    end?: number;
}

const tinyLineChart = (props: IProps) => {

    const {datasource} = props;
    if (!datasource) {
        return null;
    }

    const {data} = datasource;
    if (!data) {
        return (<Loader active={true} inline={true}/>);
    }

    const downSampledDataLTOB: DataPoint[] = LTOB(data.map((ds: IDateTimeValue) => ({
        x: ds.timeStamp,
        y: ds.value
    })), 50);

    return (
        <LineChart width={100} height={30} data={downSampledDataLTOB} key={Math.random()}>
            <YAxis
                dataKey={'y'}
                domain={['auto', 'auto']}
                hide={true}
            />
            <Line type="monotone" dataKey="y" dot={false} stroke={props.color ? props.color : 'purple'}/>
        </LineChart>
    );
};

export default tinyLineChart;
