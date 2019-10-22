import {concat} from 'lodash';
import {Collection} from '../collection/Collection';
import {DataSourceFactory} from './index';
import {IDataSource, IDateTimeValue} from './Sensor.type';

export class DataSourceCollection extends Collection<IDataSource> {
    public static fromObject(obj: IDataSource[]) {
        return new DataSourceCollection(obj);
    }

    public globalBegin = () => {
        const dss = this.all.map((ds) => DataSourceFactory.fromObject(ds));
        const mins = dss.map((ds) => {
            if (ds) {
                if (ds.data && ds.data.length > 0) {
                    return ds.data[0].timeStamp;
                }
            }
            return null;
        }).filter((e) => e !== null) as number[];

        return Math.min(...mins);
    };

    public globalEnd = () => {
        const dss = this.all.map((ds) => DataSourceFactory.fromObject(ds));
        const maxs = dss.map((ds) => {
            if (ds) {
                if (ds.data && ds.data.length > 0) {
                    return ds.data[ds.data.length - 1].timeStamp;
                }
            }
            return null;
        }).filter((e) => e !== null) as number[];

        return Math.max(...maxs);
    };

    public getMergedData = () => {
        let result: IDateTimeValue[] = [];
        this.all.forEach((ds, key) => {
            const d = DataSourceFactory.fromObject(ds);
            if (d.data) {
                if (key === 0) {
                    result = d.data;
                    return;
                }

                if (d.data.length === 0) {
                    return;
                }

                const begin = d.data[0].timeStamp;
                const end = d.data[d.data.length - 1].timeStamp;

                result = result.filter((d) => d.timeStamp < begin || d.timeStamp > end);
                result = concat(result, d.data);
                result.sort((a, b) => a.timeStamp - b.timeStamp);
            }
        });

        return result;
    };

    public toObject() {
        return this.all;
    }
}

export default DataSourceCollection;
