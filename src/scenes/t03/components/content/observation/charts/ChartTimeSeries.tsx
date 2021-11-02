import { BoundaryCollection, ModflowModel, Stressperiods } from '../../../../../../core/model/modflow';
import {
  CartesianGrid,
  LabelFormatter,
  LabelProps,
  Legend,
  LegendValueFormatter,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipFormatter,
  XAxis,
  YAxis,
} from 'recharts';
import { DropdownProps, Form, Segment } from 'semantic-ui-react';
import { EBoundaryType } from '../../../../../../core/model/modflow/boundaries/Boundary.type';
import { EResultType } from '../../../../../modflow/components/content/results/flowResults';
import { HeadObservationWell } from '../../../../../../core/model/modflow/boundaries';
import { IHeadObservationWell } from '../../../../../../core/model/modflow/boundaries/HeadObservationWell.type';
import { IRootReducer } from '../../../../../../reducers';
import { MODFLOW_CALCULATION_URL, fetchApiWithToken } from '../../../../../../services/api';
import { SyntheticEvent } from 'react-router/node_modules/@types/react';
import { cloneDeep } from 'lodash';
import { distinct } from '../../../../../modflow/defaults/colorScales';
import { misc } from '../../../../defaults/colorScales';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import React from 'react';

interface IData {
  sp: string;
  [cell: string]: number | string;
}

const ChartTimeSeries = () => {
  const [data, setData] = useState<IData[] | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [selectedWells, setSelectedWells] = useState<IHeadObservationWell[]>([]);

  const user = useSelector((state: IRootReducer) => state.user);
  const T03 = useSelector((state: IRootReducer) => state.T03);
  const boundaries = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;
  const model = T03.model ? ModflowModel.fromObject(T03.model) : null;

  useEffect(() => {
    const m = T03.model ? ModflowModel.fromObject(T03.model) : null;
    if (m) {
      const d: IData[] = [];
      m.stressperiods.totims.forEach((totim) => {
        const obj: IData = { sp: totim.toString() };
        d.push(obj);
      });
      setData(d);
    }
  }, [T03.model]);

  if (!boundaries) {
    return null;
  }

  const hobs = boundaries.findBy('type', EBoundaryType.HOB);

  const getYAxisLabel = (): LabelProps => {
    return { value: 'Head (m asl)', position: 'insideLeft', angle: -90, fill: '#4C4C4C', fontSize: '13px' };
  };

  const handleChangeSelectedWell = async (e: SyntheticEvent, { value }: DropdownProps) => {
    if (!model || !Array.isArray(value) || !data) {
      return null;
    }

    const filteredWells = value.filter((w) => selectedWells.filter((sw) => sw.id === w).length === 0) as string[];

    if (filteredWells.length === 0) {
      const wellToRemove = [...selectedWells].filter((sw) => value.filter((w) => w === sw.id).length === 0);
      if (wellToRemove.length > 0) {
        const hob = HeadObservationWell.fromObject(wellToRemove[0]);
        setData(
          cloneDeep(data).map((row) => {
            delete row[`${hob.id}_observed`];
            delete row[`${hob.id}_simulated`];
            return row;
          })
        );
        setSelectedWells([...selectedWells].filter((sw) => value.filter((w) => w === sw.id).length > 0));
      }
    }

    if (filteredWells.length > 0) {
      const hob = boundaries.findById(filteredWells[0]);
      if (hob instanceof HeadObservationWell) {
        setIsFetching(true);
        const c = await fetchApiWithToken(
          `${MODFLOW_CALCULATION_URL}/${model?.calculationId}/timeseries/types/${EResultType.HEAD}/layers/0/rows/${hob.row}/columns/${hob.column}`
        );

        const d = data.map((row) => {
          const totim = parseFloat(row.sp);
          const keys = hob.getDateTimes(model.stressperiods).map((d) => model.stressperiods.totimFromDate(d));
          const keyOfStressperiod = keys.indexOf(totim);
          const obs = c.data.filter((row: number[]) => row[0] === totim);

          return {
            ...row,
            [`${hob.id}_observed`]:
              keyOfStressperiod > -1 ? hob.getSpValues(model.stressperiods)[keyOfStressperiod][0] : undefined,
            [`${hob.id}_simulated`]: obs.length > 0 ? obs[0][1] : undefined,
          };
        });

        setData(d);

        const cSelectedWells = cloneDeep(selectedWells);
        cSelectedWells.push(hob.toObject());
        setSelectedWells(cSelectedWells);
      }
      setIsFetching(false);
    }
  };

  const legendFormatter: LegendValueFormatter = (value) => {
    const hob = boundaries.findById(value.substr(0, value.indexOf('_')));
    return hob ? value.replace(hob.id, hob.name) : value;
  };

  const labelFormatter: LabelFormatter = (value) => {
    if (!model) {
      return value;
    }

    return Stressperiods.dateTimeFromTotim(
      model.stressperiods.startDateTime,
      Number(value),
      model.stressperiods.timeUnit
    ).format(user.settings.dateFormat);
  };

  const tooltipFormatter: TooltipFormatter = (value, name, entry) => {
    if (typeof name !== 'string') {
      return value;
    }

    const hob = boundaries.findById(name.substr(0, name.indexOf('_')));

    if (!hob) {
      return value;
    }

    entry.name = name.replace(hob.id, hob.name);
    return value;
  };

  return (
    <>
      <Form>
        <Form.Select
          label="Head observation well"
          multiple
          onChange={handleChangeSelectedWell}
          options={hobs.map((hob) => {
            return {
              key: hob.id,
              value: hob.id,
              text: hob.name,
            };
          })}
          value={selectedWells.map((w) => w.id)}
        />
      </Form>
      {data && selectedWells.length > 0 && (
        <Segment raised={true} loading={isFetching}>
          <ResponsiveContainer aspect={1.5}>
            <LineChart data={data}>
              <XAxis dataKey="sp" />
              <YAxis label={getYAxisLabel()} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip formatter={tooltipFormatter} labelFormatter={labelFormatter} />
              <ReferenceLine stroke="#000" strokeDasharray="3 3" />
              {selectedWells.map((hob, key) => (
                <React.Fragment key={`${hob.id}_${key}`}>
                  <Line
                    type="monotone"
                    dataKey={`${hob.id}_simulated`}
                    stroke={key < distinct.length ? distinct[key] : distinct[misc.length - 1]}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey={`${hob.id}_observed`}
                    stroke={key < distinct.length ? distinct[key] : distinct[misc.length - 1]}
                    strokeDasharray="2"
                    activeDot={{ r: 8 }}
                  />
                </React.Fragment>
              ))}
              <Legend
                iconType="plainline"
                iconSize={30}
                verticalAlign="bottom"
                wrapperStyle={{ bottom: -10, left: 0 }}
                formatter={legendFormatter}
              />
            </LineChart>
          </ResponsiveContainer>
        </Segment>
      )}
    </>
  );
};

export default ChartTimeSeries;
