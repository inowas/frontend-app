import { ISensorDataSource } from '../../../../core/model/rtm/monitoring/Sensor.type';
import { SensorDataSource } from '../../../../core/model/rtm/monitoring';
import { cloneDeep } from 'lodash';
import { fetchUrl } from '../../../../services/api';
import { servers } from '../../defaults';
import { useEffect, useState } from 'react';

export interface ISensorMetaData {
  name: string;
  location: string;
  project: string;
  properties?: string[]; // uit-sensors.inowas.com - metadata, deprecated
  parameters?: string[]; // sensors.inowas.com - the new server
}

export const useSensorDatasource = (ds: SensorDataSource | null) => {
  const [dataSource, setDataSource] = useState<ISensorDataSource | null>(ds ? ds.toObject() : null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [metaData, setMetaData] = useState<ISensorMetaData[]>([]);

  useEffect(() => {
    if (!ds) {
      const server = servers[0].url;
      fetchMetaData(server, async (d) => {
        if (d.length > 0) {
          const smd = d[0];
          const { project, name, properties, parameters } = smd;
          if (properties && properties.length === 0) {
            return;
          }

          if (parameters && parameters.length === 0) {
            return;
          }

          const params = properties || parameters;

          if (!params) {
            return;
          }

          const ds = SensorDataSource.fromParams(server, project, name, params[0]);
          if (!(ds instanceof SensorDataSource)) {
            return;
          }

          ds.data = await ds.loadData();

          setDataSource(ds.toObject());
        }
      });
    }
  }, [ds]);

  const fetchMetaData = async (server: string, onSuccess?: (d: ISensorMetaData[]) => any) => {
    const filteredServers = cloneDeep(servers).filter((s) => (s.url = server));
    if (filteredServers.length === 0) {
      return;
    }

    const srv = filteredServers[0];

    setIsFetching(true);

    let url = new URL(`${srv.protocol}://${srv.url}/${srv.path}`).toString();

    // URL 'uit-sensors.inowas.com' needs to finish with a dash
    // it's a dirty fix but it works
    if (srv.url === 'uit-sensors.inowas.com') {
      url += '/';
    }

    fetchUrl(
      url,
      (d: ISensorMetaData[]) => {
        setMetaData(d);
        setIsFetching(false);
        if (onSuccess) {
          onSuccess(d);
        }
      },
      () => {
        setIsFetching(false);
      }
    );
    if (onSuccess) {
      onSuccess([]);
    }
  };

  const updateDataSource = async (ds: SensorDataSource) => {
    setIsFetching(true);
    ds.data = await ds.loadData();
    setIsFetching(false);
    setDataSource(ds.toObject());
  };

  const updateServer = (server: string) => {
    if (!dataSource) {
      return;
    }
    const ds = SensorDataSource.fromObject(dataSource);
    ds.server = server;
    setDataSource(ds.toObject());
    fetchMetaData(server);
  };

  return {
    dataSource: dataSource ? SensorDataSource.fromObject(dataSource) : null,
    isFetching,
    metaData,
    updateDataSource,
    updateServer,
  };
};
