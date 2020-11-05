import {Collection} from '../../collection/Collection';
import {DataSourceFactory} from './index';
import {IDataSource, IDateTimeValue} from './Sensor.type';
import {cloneDeep, concat} from 'lodash';

export class DataSourceCollection extends Collection<IDataSource> {
    public static fromObject(obj: IDataSource[]) {
        return new DataSourceCollection(cloneDeep(obj));
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
        for (const dsObj of this.all) {
            const dsInst = DataSourceFactory.fromObject(dsObj);
            await dsInst.loadData();
        }

        return this.mergeData();
    }

    public toObject() {
        return this.all;
    }

    private mergeData = () => {
        let result: IDateTimeValue[] = [];
        this.all.forEach((dsObj, key) => {
            const dsInst = DataSourceFactory.fromObject(dsObj);
            if (dsInst.data) {
                if (key === 0) {
                    result = dsInst.data;
                    return;
                }

                if (dsInst.data.length === 0) {
                    return;
                }

                const begin = dsInst.data[0].timeStamp;
                const end = dsInst.data[dsInst.data.length - 1].timeStamp;

                result = result.filter((d) => d.timeStamp < begin || d.timeStamp > end);
                result = concat(result, dsInst.data);
                result.sort((a, b) => a.timeStamp - b.timeStamp);
            }
        });

        return result;
    };
}

export default DataSourceCollection;
