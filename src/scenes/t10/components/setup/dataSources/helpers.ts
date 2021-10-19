import moment from 'moment';

export const parseDate = (ts: number | string | null) => {
  if (ts === null || (typeof ts === 'number' && isNaN(ts))) {
    return null;
  }
  if (typeof ts === 'string') {
    ts = parseInt(ts, 10);
  }

  const d = moment.unix(ts);

  if (d.isValid()) {
    return d.toDate();
  }

  return null;
};
