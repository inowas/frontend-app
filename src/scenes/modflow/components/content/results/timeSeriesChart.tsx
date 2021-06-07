import {Array2D} from '../../../../../core/model/geometry/Array2D.type';
import {
  CartesianGrid,
  LabelProps,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {EResultType} from './flowResults';
import {misc} from '../../../defaults/colorScales';
import React, {useEffect, useState} from 'react';

interface IData {
  sp: string;
  [cell: string]: number | string;
}

interface IProps {
  selectedCells: Array<[number, number, Array2D<number>]>;
  type: EResultType;
}

const TimeSeriesChart = (props: IProps) => {
  const [data, setData] = useState<IData[]>([]);

  useEffect(() => {
    const d: IData[] = [];
    const stressperiods = props.selectedCells[0][2].map((r) => r[0]);

    stressperiods.forEach((sp, key) => {
      const obj: IData = {sp: sp.toString()};
      props.selectedCells.forEach((c) => {
        obj[`${c[0]}_${c[1]}`] = c[2][key][1];
      });
      d.push(obj);
    });
    setData(d);
  }, [props.selectedCells]);

  const getYAxisLabel = (): LabelProps => {
    if (props.type === 'head') {
      return {value: 'Head (m asl)', position: 'insideLeft', angle: -90, fill: '#4C4C4C', fontSize: '13px'};
    }

    if (props.type === 'drawdown') {
      return {value: 'Drawdown (m)', position: 'insideLeft', angle: -90, fill: '#4C4C4C', fontSize: '13px'};
    }

    return {};
  };

  return (
    <ResponsiveContainer aspect={1.5}>
      <LineChart data={data}>
        <XAxis dataKey="sp" domain={['dataMin', 'dataMax']}/>
        <YAxis label={getYAxisLabel()}/>
        <CartesianGrid strokeDasharray="3 3"/>
        <Tooltip/>
        <ReferenceLine stroke="#000" strokeDasharray="3 3"/>
        {props.selectedCells.map((c, key) => (
          <Line
            key={key}
            type="monotone"
            dataKey={`${c[0]}_${c[1]}`}
            stroke={key < misc.length ? misc[key] : misc[misc.length - 1]}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TimeSeriesChart;
