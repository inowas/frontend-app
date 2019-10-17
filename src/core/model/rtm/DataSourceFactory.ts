import {FileDataSource} from './index';
import {IDataSource, IFileDataSource, ISensorDataSource} from './Sensor.type';
import SensorDataSource from './SensorDataSource';

function isSensorDataSource(arg: any): arg is ISensorDataSource {
    return arg.url !== undefined;
}

function isFileDataSource(arg: any): arg is IFileDataSource {
    return arg.file !== undefined;
}

export class DataSourceFactory {

    public static fromObject(obj: IDataSource): FileDataSource | SensorDataSource {
        if (isFileDataSource(obj)) {
            return FileDataSource.fromObject(obj);
        }

        if (isSensorDataSource(obj)) {
            return SensorDataSource.fromObject(obj);
        }

        throw new Error('Datasource plain object does not match.');
    }
}

export default DataSourceFactory;
