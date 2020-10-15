import {Point} from 'geojson';
import {IDataDropperFile} from '../../../services/dataDropper/DataDropper.type';
import FileDataSource from './FileDataSource';
import {IProcessing} from './processing/Processing.type';
import PrometheusDataSource from './PrometheusDataSource';
import SensorDataSource from './SensorDataSource';

export interface ISensor {
    id: string;
    name: string;
    geolocation: Point;
    parameters: ISensorParameter[];
}

export interface ISensorParameter {
    id: string;
    type: string;
    description: string;
    dataSources: IDataSource[];
    filter?: [];
    processings: IProcessing[];
    unit?: string;
}

export type DataSource = FileDataSource | PrometheusDataSource | SensorDataSource;
export type IDataSource = IFileDataSource | IPrometheusDataSource | ISensorDataSource;

export type IFileDataSource = IReducedFileDataSource & IFetchDataSource;
export type ISensorDataSource = IReducedSensorDataSource & IFetchDataSource;

export interface IPrometheusDataSource {
    id: string;
    protocol: string;
    hostname: string;
    query: string;
    start: number;
    end?: number;
    step: number;
    fetching?: boolean;
    fetched?: boolean;
    error?: any;
    data?: IDateTimeValue[] | null;
}

export interface IPrometheusResponseData {
    data: {
        result: IPrometheusResult[];
        resultType: string;
    };
    status: string;
    error?: string;
}

interface IPrometheusResult {
    metric: {
        [key: string]: number | string;
    };
    value?: [number, string];
    values?: Array<[number, string]>;
}

export interface IReducedSensorDataSource {
    id: string;
    url: string;
}

export interface IReducedFileDataSource {
    id: string;
    file: IDataDropperFile;
}

// todo: GENERIC (IDateTimeValue to Array2D)
export interface IFetchDataSource {
    fetching?: boolean;
    fetched?: boolean;
    error?: any;
    data?: IDateTimeValue[] | null;
}

export interface IDateTimeValue {
    timeStamp: number;
    value: number;
}

export interface ISensorData {
    url: string;
}

export interface IServerSensorData {
    date_time: string;

    [key: string]: number | string;
}
