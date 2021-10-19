import { IPrometheusDataSource } from '../../../../core/model/rtm/monitoring/Sensor.type';
import { PrometheusDataSource } from '../../../../core/model/rtm/monitoring';
import { prometheusServers } from '../../defaults';
import { useEffect, useState } from 'react';
import moment from 'moment';
import uuid from 'uuid';

export const usePrometheusDatasource = (ds: PrometheusDataSource | null) => {
  const [autoUpdate, setAutoUpdate] = useState<boolean>(ds ? !ds.end : false);
  const [dataSource, setDataSource] = useState<IPrometheusDataSource | null>(ds ? ds.toObject() : null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    if (!ds) {
      const cDataSource = PrometheusDataSource.fromObject({
        id: uuid.v4(),
        protocol: 'https',
        hostname: prometheusServers[0].url,
        query: 'pegel_online_wsv_sensors{station="DRESDEN", type="waterlevel"}/100',
        start: moment().subtract(1, 'week').unix(),
        end: undefined,
        step: 120,
      });
      updateDataSource(cDataSource);
    } else {
      updateDataSource(ds);
    }
  }, [ds]);

  const toggleAutoUpdate = () => {
    if (!dataSource) {
      return;
    }

    const cDataSource = PrometheusDataSource.fromObject(dataSource);
    if (autoUpdate) {
      setAutoUpdate(false);
      cDataSource.end = moment.utc().unix();
      return setDataSource(cDataSource.toObject());
    }

    setAutoUpdate(true);
    cDataSource.end = undefined;
    setDataSource(cDataSource.toObject());
  };

  const updateDataSource = async (s: PrometheusDataSource) => {
    s.data = null;
    setIsFetching(true);
    await s.loadData();
    setIsFetching(false);
    setDataSource(s.toObject());
  };

  return {
    autoUpdate,
    dataSource: dataSource ? PrometheusDataSource.fromObject(dataSource) : null,
    isFetching,
    toggleAutoUpdate,
    updateDataSource,
  };
};
