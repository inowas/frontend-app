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
import {Form, InputProps} from 'semantic-ui-react';
import {misc} from '../../../defaults/colorScales';
import React, {ChangeEvent, useEffect, useState} from 'react';

interface IData {
  sp: string;

  [cell: string]: number | string;
}

interface IProps {
  selectedCells: Array<[number, number, Array2D<number>]>;
  type: EResultType;
}

const TimeSeriesChart = (props: IProps) => {
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [activeValue, setActiveValue] = useState<string>('');
  const [data, setData] = useState<IData[]>([]);
  const [minMax, setMinMax] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const d: IData[] = [];
    const stressperiods = props.selectedCells[0][2].map((r) => r[0]);

    let min = NaN, max = NaN;

    stressperiods.forEach((sp, key) => {
      const obj: IData = {sp: sp.toString()};
      props.selectedCells.forEach((c) => {
        if (isNaN(min) || c[2][key][1] < min) {
          min = Math.floor(c[2][key][1]);
        }
        if (isNaN(max) || c[2][key][1] > max) {
          max = Math.ceil(c[2][key][1]);
        }
        obj[`${c[0]}_${c[1]}`] = c[2][key][1];
      });
      d.push(obj);
    });
    setData(d);
    setMinMax([min, max]);
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

  const handleBlur = () => {
    if (activeInput === 'min') {
      setMinMax([parseFloat(activeValue), minMax[1]]);
    }
    if (activeInput === 'max') {
      setMinMax([minMax[0], parseFloat(activeValue)]);
    }
    setActiveInput(null);
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputProps) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  return (
    <>
      <Form>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Min Head"
            name="min"
            onBlur={handleBlur}
            onChange={handleChange}
            value={activeInput === 'min' ? activeValue : minMax[0]}
            type="number"
          />
          <Form.Input
            fluid
            label="Max Head"
            name="max"
            onBlur={handleBlur}
            onChange={handleChange}
            value={activeInput === 'max' ? activeValue : minMax[1]}
            type="number"
          />
        </Form.Group>
      </Form>
      <ResponsiveContainer aspect={1.5}>
        <LineChart data={data}>
          <XAxis dataKey="sp" domain={['dataMin', 'dataMax']}/>
          <YAxis label={getYAxisLabel()} domain={minMax}/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <ReferenceLine stroke="#000" strokeDasharray="3 3"/>
          {props.selectedCells.map((c, key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={`${c[0]}_${c[1]}`}
              stroke={key < misc.length ? misc[key] : misc[misc.length - 1]}
              activeDot={{r: 8}}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default TimeSeriesChart;
