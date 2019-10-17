import moment from 'moment';
import React from 'react';
import FileDataSource from '../../../core/model/rtm/FileDataSource';
import SensorDataSource from '../../../core/model/rtm/SensorDataSource';

interface IProps {
    datasource: SensorDataSource | FileDataSource | null;
    color?: string;
}

const dsTimeRange = (props: IProps) => {

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

export default dsTimeRange;
