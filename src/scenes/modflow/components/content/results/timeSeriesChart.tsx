import { Array2D } from '../../../../../core/model/geometry/Array2D.type';
import { Button, Form, Icon, InputProps } from 'semantic-ui-react';
import {
  CartesianGrid,
  LabelProps,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChangeEvent, useEffect, useState } from 'react';
import { EResultType } from './flow/FlowResults';
import { HeadObservationWell } from '../../../../../core/model/modflow/boundaries';
import { Stressperiods } from '../../../../../core/model/modflow';
import { cloneDeep } from 'lodash';
import { exportData } from '../../../../shared/simpleTools/helpers';
import { misc } from '../../../defaults/colorScales';

interface IData {
  sp: string;
  [cell: string]: number | string;
}

interface IProps {
  headObservationWells: HeadObservationWell[];
  selectedCells: Array<[number, number, Array2D<number>]>;
  stressperiods: Stressperiods;
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
    const combinedStressperiods = cloneDeep(stressperiods);

    props.headObservationWells.forEach((hob) => {
      hob
        .getDateTimes(props.stressperiods)
        .map((d) => props.stressperiods.totimFromDate(d))
        .forEach((dt) => {
          if (!combinedStressperiods.includes(dt)) {
            combinedStressperiods.push(dt);
          }
        });
    });

    let min = NaN,
      max = NaN;

    combinedStressperiods
      .sort((a, b) => a - b)
      .forEach((sp) => {
        const obj: IData = { sp: sp.toString() };
        if (stressperiods.includes(sp)) {
          const key = stressperiods.indexOf(sp);
          props.selectedCells.forEach((c) => {
            if (isNaN(min) || c[2][key][1] < min) {
              min = Math.floor(c[2][key][1]);
            }
            if (isNaN(max) || c[2][key][1] > max) {
              max = Math.ceil(c[2][key][1]);
            }
            obj[`${c[0]}_${c[1]}`] = c[2][key][1];
          });
        }

        props.headObservationWells.forEach((hob: HeadObservationWell) => {
          const keys = hob.getDateTimes(props.stressperiods).map((d) => props.stressperiods.totimFromDate(d));
          const keyOfStressperiod = keys.indexOf(sp);

          if (keyOfStressperiod > -1) {
            obj[hob.name] = hob.getSpValues(props.stressperiods)[keyOfStressperiod][0];
          }
        });

        d.push(obj);
      });

    setData(d);
    setMinMax([min, max]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedCells, props.headObservationWells]);

  const getYAxisLabel = (): LabelProps => {
    if (props.type === 'head') {
      return { value: 'Head (m asl)', position: 'insideLeft', angle: -90, fill: '#4C4C4C', fontSize: '13px' };
    }

    if (props.type === 'drawdown') {
      return { value: 'Drawdown (m)', position: 'insideLeft', angle: -90, fill: '#4C4C4C', fontSize: '13px' };
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
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, { name, value }: InputProps) => {
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
      <div className="downloadButtons">
        <Button compact={true} basic={true} icon={true} size={'small'} onClick={exportData(data, 'timeSeries')}>
          <Icon name="download" /> CSV
        </Button>
      </div>
      <ResponsiveContainer aspect={1.5}>
        <LineChart data={data}>
          <XAxis dataKey="sp" domain={['dataMin', 'dataMax']} />
          <YAxis label={getYAxisLabel()} domain={minMax} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <ReferenceLine stroke="#000" strokeDasharray="3 3" />
          {props.selectedCells.map((c, key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={`${c[0]}_${c[1]}`}
              stroke={key < misc.length ? misc[key] : misc[misc.length - 1]}
              activeDot={{ r: 8 }}
            />
          ))}
          {props.headObservationWells.map((hob, key) => (
            <Line
              key={`${hob.name}_${key}`}
              type="monotone"
              dataKey={hob.name}
              stroke="#000000"
              strokeDasharray="2"
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default TimeSeriesChart;
