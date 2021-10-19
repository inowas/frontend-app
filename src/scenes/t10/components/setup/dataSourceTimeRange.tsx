import { DataSource } from '../../../../core/model/rtm/monitoring/Sensor.type';
import moment from 'moment';

interface IProps {
  datasource: DataSource | null;
  color?: string;
  dateTimeFormat?: 'string';
}

const DsTimeRange = (props: IProps) => {
  if (!props.datasource) {
    return null;
  }

  const beginTimeStamp = props.datasource.begin;
  const endTimeStamp = props.datasource.end;
  const dateTimeFormat = props.dateTimeFormat ? props.dateTimeFormat : 'YYYY/MM/DD';

  let begin = '';
  if (beginTimeStamp) {
    begin = moment.unix(beginTimeStamp).format(dateTimeFormat);
  }

  let end = '';
  if (endTimeStamp) {
    end = moment.unix(endTimeStamp).format(dateTimeFormat);
  }

  if (!endTimeStamp) {
    end = moment.utc().format(dateTimeFormat);
  }

  return (
    <span>
      {begin} - {end}
    </span>
  );
};

export default DsTimeRange;
