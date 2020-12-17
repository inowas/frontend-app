import {FileDataSource} from './index';
import {IDataSource, IFileDataSource, IPrometheusDataSource, ISensorDataSource} from './Sensor.type';
import PrometheusDataSource from './PrometheusDataSource';
import SensorDataSource from './SensorDataSource';

function isFileDataSource(arg: any): arg is IFileDataSource {
    return arg.file !== undefined;
}

function isPrometheusDataSource(arg: any): arg is IPrometheusDataSource {
    return arg.query !== undefined;
}

function isSensorDataSource(arg: any): arg is ISensorDataSource {
    return arg.url !== undefined;
}

export class DataSourceFactory {

    public static fromObject(obj: IDataSource): FileDataSource | SensorDataSource | PrometheusDataSource {
        if (isFileDataSource(obj)) {
            return FileDataSource.fromObject(obj);
        }

        if (isPrometheusDataSource(obj)) {
            return PrometheusDataSource.fromObject(obj);
        }

        if (isSensorDataSource(obj)) {
            return SensorDataSource.fromObject(obj);
        }

        throw new Error('Datasource plain object does not match.');
    }
}

export default DataSourceFactory;
