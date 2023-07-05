import {
  Bar,
  BarChart,
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
import { Boundary, WellBoundary } from '../../../../../core/model/modflow/boundaries';
import { IPropertyValueObject } from '../../../../../core/model/types';
import { IRootReducer } from '../../../../../reducers';
import { Stressperiods } from '../../../../../core/model/modflow';
import { distinct } from '../../../../modflow/defaults/colorScales';
import { useSelector } from 'react-redux';
import md5 from 'md5';

interface IProps {
  boundary: Boundary;
  observationPointId?: string;
  stressperiods: Stressperiods;
}

const BoundaryDateTimeValuesChart = (props: IProps) => {
  const properties = props.boundary.valueProperties;
  const spValues = props.boundary.getSpValues(props.stressperiods, props.observationPointId);

  const user = useSelector((state: IRootReducer) => state.user);

  const differentUnits = Array.from(new Set(properties.map((p) => p.unit)));

  const data = props.stressperiods.totims.map((totim, ts) => {
    const ds: IPropertyValueObject = {
      sp: totim,
    };

    properties.forEach((property, index) => {
      if (spValues.length > ts) {
        ds[property.name] = spValues[ts][index];
      }
    });

    return ds;
  });
  data.pop();

  const getYAxisLabel = (value: string, position: 'left' | 'right'): LabelProps => {
    return {
      value,
      position: position === 'left' ? 'insideLeft' : 'insideRight',
      angle: -90,
      fill: '#4C4C4C',
      fontSize: '13px',
    };
  };

  const labelFormatter = (value: any) => {
    return Stressperiods.dateTimeFromTotim(
      props.stressperiods.startDateTime,
      Number(value),
      props.stressperiods.timeUnit
    ).format(user.settings.dateFormat);
  };

  const tooltipFormatter = (value: any, name: any) => {
    const p = properties.filter((prop) => prop.name === name);
    if (p.length > 0) {
      return `${value} ${p[0].unit}`;
    }
    return `${value} ${name}`;
  };

  if (props.boundary instanceof WellBoundary) {
    return (
      <ResponsiveContainer aspect={1.5}>
        <BarChart data={data}>
          <XAxis dataKey="sp" domain={['dataMin', 'dataMax']} />
          <YAxis yAxisId="left" label={getYAxisLabel(differentUnits[0], 'left')} />
          {differentUnits.length > 1 && (
            <YAxis label={getYAxisLabel(differentUnits[1], 'right')} yAxisId="right" orientation="right" />
          )}
          <CartesianGrid strokeDasharray="3 3" />
          <Legend iconType="plainline" iconSize={30} verticalAlign="bottom" wrapperStyle={{ bottom: -10, left: 0 }} />
          <ReferenceLine y={0} yAxisId="left" stroke="#000" />
          <Tooltip labelFormatter={labelFormatter} formatter={tooltipFormatter} />
          {properties.map((p, k) => (
            <Bar
              key={md5(p.name + k)}
              fill={distinct[k]}
              dataKey={p.name}
              yAxisId={p.unit === differentUnits[0] ? 'left' : 'right'}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer aspect={1.5}>
      <LineChart data={data}>
        <XAxis dataKey="sp" domain={['dataMin', 'dataMax']} />
        <YAxis yAxisId="left" label={getYAxisLabel(differentUnits[0], 'left')} />
        {differentUnits.length > 1 && (
          <YAxis label={getYAxisLabel(differentUnits[1], 'right')} yAxisId="right" orientation="right" />
        )}
        <CartesianGrid strokeDasharray="3 3" />
        <Legend iconType="plainline" iconSize={30} verticalAlign="bottom" wrapperStyle={{ bottom: -10, left: 0 }} />
        <Tooltip labelFormatter={labelFormatter} />
        {properties.map((p, k) => (
          <Line
            key={md5(p.name + k)}
            type="monotone"
            dataKey={p.name}
            dot={false}
            stroke={distinct[k]}
            activeDot={{ r: 8 }}
            yAxisId={p.unit === differentUnits[0] ? 'left' : 'right'}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BoundaryDateTimeValuesChart;
