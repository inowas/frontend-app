import { ISensorDataSource } from '../../../../core/model/rtm/monitoring/Sensor.type';
import { SensorDataSource } from '../../../../core/model/rtm/monitoring';
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
      const server = servers[0].hostname;
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
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      fetchMetaData(ds.server, async (d) => {
        setDataSource(ds.toObject());
      });
    }
  }, [ds]);

  const fetchMetaData = async (server: string, onSuccess?: (d: ISensorMetaData[]) => any) => {
    const filteredServer = servers.find((s) => (s.hostname = server));
    if (!filteredServer) {
      return;
    }

    setIsFetching(true);

    const url = new URL(`${filteredServer.protocol}${filteredServer.hostname}${filteredServer.pathname}`).toString();
    try {
      if (onSuccess) {
        onSuccess([]);
      }
      const response = await fetch(url, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json() as ISensorMetaData[];
      setMetaData(data);
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  const updateDataSource = async (s: SensorDataSource) => {
    setIsFetching(true);
    await s.loadData();
    setIsFetching(false);
    setDataSource(s.toObject());
  };

  const updateServer = async (server: string) => {
    if (!dataSource) {
      return;
    }
    const ds = SensorDataSource.fromObject(dataSource);
    ds.server = server;
    setDataSource(ds.toObject());
    await fetchMetaData(server);
  };

  return {
    dataSource: dataSource ? SensorDataSource.fromObject(dataSource) : null,
    isFetching,
    metaData,
    updateDataSource,
    updateServer,
  };
};
