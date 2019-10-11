import {Collection} from '../collection/Collection';
import {IDataSource} from './Sensor.type';

export class DataSourceCollection extends Collection<IDataSource> {
    public static fromObject(obj: IDataSource[]) {
        return new DataSourceCollection(obj);
    }

    public toObject() {
        return this.all;
    }
}

export default DataSourceCollection;
