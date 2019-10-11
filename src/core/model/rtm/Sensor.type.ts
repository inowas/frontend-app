import {Point} from 'geojson';

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
}

import {IDateTimeValue} from './Sensor.type';

export type IDataSource = ISensorDataSource | IFileDataSource;

export interface IDataSourceBase {
    id: string;
    data?: IDateTimeValue[] | object;
}

export interface ISensorDataSource extends IDataSourceBase {
    url: string;
}

export interface IFileDataSource extends IDataSourceBase {
    filename: string;
}

export interface IDateTimeValue {
    timeStamp: number;
    value: number;
}
