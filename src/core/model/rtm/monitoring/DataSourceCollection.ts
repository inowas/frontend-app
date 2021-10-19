import { Collection } from '../../collection/Collection';
import { DataSourceFactory } from './index';
import { IDataSource, IDateTimeValue } from './Sensor.type';
import { cloneDeep, concat } from 'lodash';

export class DataSourceCollection extends Collection<IDataSource> {
  public static fromObject(obj: IDataSource[]) {
    return new DataSourceCollection(cloneDeep(obj));
  }

  public globalBegin = () => {
    const dss = this.all.map((ds) => DataSourceFactory.fromObject(ds));
    const mins = dss
      .map((ds) => {
        if (ds) {
          if (ds.data && ds.data.length > 0) {
            return ds.data[0].timeStamp;
          }
        }
        return null;
      })
      .filter((e) => e !== null) as number[];

    return Math.min(...mins);
  };

  public globalEnd = () => {
    const dss = this.all.map((ds) => DataSourceFactory.fromObject(ds));
    const maxs = dss
      .map((ds) => {
        if (ds) {
          if (ds.data && ds.data.length > 0) {
            return ds.data[ds.data.length - 1].timeStamp;
          }
        }
        return null;
      })
      .filter((e) => e !== null) as number[];

    return Math.max(...maxs);
  };

  public isFetched = () => {
    let isFetched = true;
    this.all.forEach((ds) => {
      if (ds.data === undefined) {
        isFetched = false;
      }
    });

    return isFetched;
  };

  public async mergedData() {
    const dataSets = [];
    for (const dsObj of this.all) {
      const dsInst = DataSourceFactory.fromObject(dsObj);
      dataSets.push(await dsInst.loadData());
    }

    return this.mergeData(dataSets);
  }

  public toObject() {
    return this.all;
  }

  private mergeData = (dataSets: any[]) => {
    let result: IDateTimeValue[] = [];
    dataSets.forEach((data, key) => {
      if (data) {
        if (key === 0) {
          result = data;
          return;
        }

        if (data.length === 0) {
          return;
        }

        const begin = data[0].timeStamp;
        const end = data[data.length - 1].timeStamp;

        result = result.filter((d) => d.timeStamp < begin || d.timeStamp > end);
        result = concat(result, data);
        result.sort((a, b) => a.timeStamp - b.timeStamp);
      }
    });

    return result;
  };
}

export default DataSourceCollection;
