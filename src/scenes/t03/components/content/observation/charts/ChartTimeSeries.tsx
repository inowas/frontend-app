import { BoundaryCollection, ModflowModel } from '../../../../../../core/model/modflow';
import {
  CartesianGrid,
  LabelProps,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { DropdownProps, Form, InputProps, Segment } from 'semantic-ui-react';
import { EBoundaryType } from '../../../../../../core/model/modflow/boundaries/Boundary.type';
import { EResultType } from '../../../../../modflow/components/content/results/flowResults';
import { HeadObservationWell } from '../../../../../../core/model/modflow/boundaries';
import { IHeadObservationWell } from '../../../../../../core/model/modflow/boundaries/HeadObservationWell.type';
import { IRootReducer } from '../../../../../../reducers';
import { MODFLOW_CALCULATION_URL, fetchApiWithToken } from '../../../../../../services/api';
import { SyntheticEvent } from 'react-router/node_modules/@types/react';
import { misc } from '../../../../defaults/colorScales';
import { useSelector } from 'react-redux';

interface IData {
  sp: string;
  [cell: string]: number | string;
}

const ChartTimeSeries = () => {
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [activeValue, setActiveValue] = useState<string>('');
  const [data, setData] = useState<IData[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [minMax, setMinMax] = useState<[number, number]>([0, 0]);
  const [selectedWell, setSelectedWell] = useState<IHeadObservationWell | null>(null);

  const T03 = useSelector((state: IRootReducer) => state.T03);
  const boundaries = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;

  const fetchCellData = useCallback(async () => {
    const model = T03.model ? ModflowModel.fromObject(T03.model) : null;
    if (!model || !selectedWell) {
      return;
    }

    const hob = HeadObservationWell.fromObject(selectedWell);

    setIsFetching(true);
    try {
      const c = await fetchApiWithToken(
        `${MODFLOW_CALCULATION_URL}/${model?.calculationId}/timeseries/types/${EResultType.HEAD}/layers/0/rows/${hob.row}/columns/${hob.column}`
      );
      if (c.data && Array.isArray(c.data)) {
        const d: IData[] = [];
        model.stressperiods.totims.forEach((totim) => {
          const obj: IData = { sp: totim.toString() };
          const keys = hob.getDateTimes(model.stressperiods).map((d) => model.stressperiods.totimFromDate(d));
          const keyOfStressperiod = keys.indexOf(totim);
          if (keyOfStressperiod > -1) {
            obj.observed = hob.getSpValues(model.stressperiods)[keyOfStressperiod][0];
          }

          const obs = c.data.filter((row: number[]) => row[0] === totim);
          if (obs.length > 0) {
            obj.simulated = obs[0][1];
          }

          d.push(obj);
        });

        const observed = [...d.map((r) => r.observed)].filter((n) => typeof n === 'number') as number[];
        const simulated = [...d.map((r) => r.simulated)].filter((n) => typeof n === 'number') as number[];

        const max = Math.ceil(Math.max(...observed.concat(simulated)));
        const min = Math.floor(Math.min(...observed.concat(simulated)));

        setMinMax([min, max]);
        setData(d);
        return c.data;
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsFetching(false);
    }
  }, [T03.model, selectedWell]);

  useEffect(() => {
    fetchCellData();
  }, [fetchCellData, selectedWell]);

  if (!boundaries) {
    return null;
  }

  const hobs = boundaries.findBy('type', EBoundaryType.HOB);

  const getYAxisLabel = (): LabelProps => {
    return { value: 'Head (m asl)', position: 'insideLeft', angle: -90, fill: '#4C4C4C', fontSize: '13px' };
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

  const handleChangeSelectedWell = (e: SyntheticEvent, { value }: DropdownProps) => {
    if (typeof value === 'string') {
      const hob = boundaries.findById(value);
      if (hob instanceof HeadObservationWell) {
        setSelectedWell(hob.toObject());
      }
    }
  };

  return (
    <Segment raised={true} loading={isFetching}>
      <Form>
        <Form.Select
          label="Head observation well"
          onChange={handleChangeSelectedWell}
          options={hobs.map((hob) => {
            return {
              key: hob.id,
              value: hob.id,
              text: hob.name,
            };
          })}
        />
        {data.length > 0 && (
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
        )}
      </Form>
      {data.length > 0 && (
        <ResponsiveContainer aspect={1.5}>
          <LineChart data={data}>
            <XAxis dataKey="sp" domain={['dataMin', 'dataMax']} />
            <YAxis label={getYAxisLabel()} domain={minMax} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <ReferenceLine stroke="#000" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="simulated" stroke={misc[0]} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="observed" stroke={misc[0]} strokeDasharray="2" activeDot={{ r: 8 }} />
            <Legend iconType="plainline" iconSize={30} verticalAlign="middle" wrapperStyle={{ top: 0, left: 350 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Segment>
  );
};

export default ChartTimeSeries;
