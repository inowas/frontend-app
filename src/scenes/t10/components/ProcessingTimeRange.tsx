import moment from 'moment';
import React from 'react';
import TimeProcessing from '../../../core/model/rtm/processing/TimeProcessing';
import ValueProcessing from '../../../core/model/rtm/processing/ValueProcessing';

interface IProps {
    processing: ValueProcessing | TimeProcessing;
    color?: string;
}

const ProcessingTimeRange = (props: IProps) => {

    const {processing} = props;
    if (!processing) {
        return null;
    }

    const beginTimeStamp = processing.begin;
    const endTimeStamp = processing.end;

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

export default ProcessingTimeRange;
