import { useState } from 'react';
import RangeWithTooltip from '../../../shared/complexTools/RangeWithTooltip';
import moment from 'moment';

interface IProps {
  onChange: (ts: [number, number]) => any;
  onMove: (ts: [number, number]) => any;
  timeSteps: number[];
  format?: string;
  readOnly?: boolean;
  value?: [number, number];
}

const TimeSlider = (props: IProps) => {
  const [startIndex, setStartIndex] = useState<number>(props.value ? props.value[0] : 0);
  const [endIndex, setEndIndex] = useState<number>(props.value ? props.value[1] : props.timeSteps.length - 1);

  const handleChangeRange = (e: [number, number]) => {
    setStartIndex(e[0]);
    setEndIndex(e[1]);
    return props.onMove(e);
  };

  const tipFormatter = (s: number) => moment.unix(props.timeSteps[s]).format(props.format || 'YYYY-MM-DD HH:mm:ss');

  return (
    <RangeWithTooltip
      allowCross={false}
      defaultValue={props.value}
      disabled={props.readOnly}
      min={0}
      max={props.timeSteps.length - 1}
      value={[startIndex, endIndex]}
      onChange={handleChangeRange}
      onAfterChange={props.onChange}
      style={{
        marginTop: '8px',
      }}
      tipFormatter={tipFormatter}
    />
  );
};

export default TimeSlider;
