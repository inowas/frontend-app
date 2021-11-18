import {
  Bar,
  BarChart,
  LabelFormatter,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipFormatter,
  XAxis,
  YAxis,
} from 'recharts';
import { IDateTimeValue } from '../../../../../core/model/rtm/monitoring/Sensor.type';
import { IRootReducer } from '../../../../../reducers';
import { IValueProperty } from '../../../../../core/model/modflow/boundaries/Boundary.type';
import { distinct } from '../../../../modflow/defaults/colorScales';
import { useSelector } from 'react-redux';
import md5 from 'md5';
import moment from 'moment';

interface IProps {
  data: IDateTimeValue[];
  domain?: [number, number];
  type: 'line' | 'bar';
}

const BoundaryDateTimeValuesPreviewChart = (props: IProps) => {
  const properties: IValueProperty[] = [
    {
      name: 'value',
      description: 'Value',
      unit: '',
      decimals: 2,
      default: 1,
    },
  ];

  const user = useSelector((state: IRootReducer) => state.user);

  const labelFormatter: LabelFormatter = (value) => {
    if (typeof value === 'number') {
      return moment.unix(value).utc().format(user.settings.dateFormat);
    }
  };

  const tooltipFormatter: TooltipFormatter = (value, name) => {
    const p = properties.filter((prop) => prop.name === name);
    if (p.length > 0) {
      return `${value} ${p[0].unit}`;
    }
    return `${value} ${name}`;
  };

  const filteredData = props.data.filter(
    (d) => !props.domain || (props.domain && d.timeStamp >= props.domain[0] && d.timeStamp <= props.domain[1])
  );

  if (props.type === 'bar') {
    return (
      <ResponsiveContainer aspect={1.5}>
        <BarChart data={filteredData}>
          <XAxis dataKey="timeStamp" tickFormatter={(dt) => moment.unix(dt).utc().format(user.settings.dateFormat)} />
          <YAxis domain={['dataMin', 'dataMax']} />
          <ReferenceLine y={0} yAxisId="left" stroke="#000" />
          <Tooltip labelFormatter={labelFormatter} formatter={tooltipFormatter} />
          {properties.map((p, k) => (
            <Bar key={md5(p.name + k)} fill={distinct[k]} dataKey={p.name} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer aspect={1.5}>
      <LineChart data={filteredData}>
        <XAxis dataKey="timeStamp" tickFormatter={(dt) => moment.unix(dt).utc().format(user.settings.dateFormat)} />
        <YAxis domain={['dataMin', 'dataMax']} />
        <Tooltip labelFormatter={labelFormatter} />
        {properties.map((p, k) => (
          <Line
            key={md5(p.name + k)}
            type="monotone"
            dataKey={p.name}
            dot={false}
            stroke={distinct[k]}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BoundaryDateTimeValuesPreviewChart;
