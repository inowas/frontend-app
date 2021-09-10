import { DataPoint, LTOB } from 'downsample';
import { DataSource, IDateTimeValue } from '../../../../../core/model/rtm/monitoring/Sensor.type';
import { Header } from 'semantic-ui-react';
import { ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis } from 'recharts';
import { SensorDataSource } from '../../../../../core/model/rtm/monitoring';
import moment from 'moment';

interface IProps {
  dataSource: DataSource;
}

const DataSourceChart = ({ dataSource }: IProps) => {
  const RenderNoShape = () => null;

  const formatDateTimeTicks = (dt: number) => {
    return moment.unix(dt).format('YYYY/MM/DD');
  };

  if (!(dataSource instanceof SensorDataSource)) {
    return <Header as={'h2'}>No data</Header>;
  }

  const { data } = dataSource;
  if (!data) {
    return null;
  }

  const downSampledDataLTOB: DataPoint[] = LTOB(
    data.map((d: IDateTimeValue) => ({
      x: d.timeStamp,
      y: d.value,
    })),
    200
  ) as DataPoint[];

  return (
    <ResponsiveContainer height={300}>
      <ScatterChart>
        <XAxis
          dataKey={'x'}
          domain={[
            data.length > 0 ? data[0].timeStamp : 'auto',
            data.length > 0 ? data[data.length - 1].timeStamp : 'auto',
          ]}
          name={'Date Time'}
          tickFormatter={formatDateTimeTicks}
          type={'number'}
        />
        <YAxis dataKey={'y'} name={dataSource.parameter} domain={['auto', 'auto']} />
        <Scatter
          data={downSampledDataLTOB}
          line={{ stroke: '#1eb1ed', strokeWidth: 2 }}
          lineType={'joint'}
          name={dataSource.parameter}
          shape={<RenderNoShape />}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default DataSourceChart;
