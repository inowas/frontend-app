import moment from 'moment';
import React from 'react';
import {DataSource} from '../../../core/model/rtm/Sensor.type';

interface IProps {
    datasource: DataSource | null;
    color?: string;
}

const DsTimeRange = (props: IProps) => {

    const {datasource} = props;
    if (!datasource) {
        return null;
    }

    const {data} = datasource;
    if (!data) {
        return null;
    }

    const beginTimeStamp = data[0].timeStamp;
    const endTimeStamp = data[data.length - 1].timeStamp;

    let begin = '';
    if (beginTimeStamp) {
        begin = moment.unix(beginTimeStamp).format('YYYY/MM/DD');
    }

    let end = '';
    if (endTimeStamp) {
        end = moment.unix(endTimeStamp).format('YYYY/MM/DD');
    }

    return <span>{begin} - {end}</span>;
};

export default DsTimeRange;
