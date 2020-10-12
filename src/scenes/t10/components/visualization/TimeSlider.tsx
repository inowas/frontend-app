import moment from 'moment';
import React, {useState} from 'react';
import RangeWithTooltip from '../../../shared/complexTools/RangeWithTooltip';

interface IProps {
    onChange: (ts: [number, number]) => any;
    onMove: (ts: [number, number]) => any;
    timeSteps: number[];
}

const timeSlider = (props: IProps) => {
    const [startIndex, setStartIndex] = useState<number>(0);
    const [endIndex, setEndIndex] = useState<number>(props.timeSteps.length - 1);

    const handleChangeRange = (e: [number, number]) => {
        setStartIndex(e[0]);
        setEndIndex(e[1]);
        return props.onMove(e);
    };

    const tipFormatter = (s: number) => moment.unix(props.timeSteps[s]).format('YYYY-MM-DD HH:mm:ss');

    return (
        <RangeWithTooltip
            allowCross={false}
            min={0}
            max={props.timeSteps.length - 1}
            value={[startIndex, endIndex]}
            onChange={handleChangeRange}
            onAfterChange={props.onChange}
            style={{
                marginTop: '8px'
            }}
            tipFormatter={tipFormatter}
        />
    );
};

export default timeSlider;