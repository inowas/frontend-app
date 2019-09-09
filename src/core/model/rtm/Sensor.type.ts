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
    dataSource: IDataSource;
    filters: IFilter[];
    data: IDateTimeValue[];
}

export type IFilter = Array<() => void>;

export interface IQueryParams {
    project: string;
    sensor: string;
    property: string;
}

export interface IDataSource {
    type: string;
    server?: string;
    queryParams?: IQueryParams;
}

export interface IDateTimeValue {
    timeStamp: string;
    value: number;
}
