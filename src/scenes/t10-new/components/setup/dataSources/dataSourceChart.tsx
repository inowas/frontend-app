import { DataPoint, LTOB } from 'downsample';
import { DataSource, IDateTimeValue } from '../../../../../core/model/rtm/monitoring/Sensor.type';
import { FileDataSource, SensorDataSource } from '../../../../../core/model/rtm/monitoring';
import { ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis } from 'recharts';
import moment from 'moment';

interface IProps {
  dataSource: DataSource;
}

const DataSourceChart = ({ dataSource }: IProps) => {
  const RenderNoShape = () => null;

  const formatDateTimeTicks = (dt: number) => {
    return moment.unix(dt).format('YYYY/MM/DD');
  };

  const data = dataSource instanceof FileDataSource ? dataSource.filteredData : dataSource.data;
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

  const parameter = dataSource instanceof SensorDataSource ? dataSource.parameter : '';

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
        <YAxis dataKey={'y'} name={parameter} domain={['auto', 'auto']} />
        <Scatter
          data={downSampledDataLTOB}
          line={{ stroke: '#1eb1ed', strokeWidth: 2 }}
          lineType={'joint'}
          name={parameter}
          shape={<RenderNoShape />}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default DataSourceChart;
