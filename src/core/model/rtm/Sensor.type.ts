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
    filters: IFilter[];
    data: IDateTimeValue[];
}

export interface IFilter {
    type: string;
    begin: number | null;
    end: number | null;
}

export interface IValueFilter extends IFilter {
    type: 'valuefilter';
}

export interface IQueryParams {
    project: string;
    sensor: string;
    property: string;
    begin?: number;
    end?: number;
}

export interface IDataSource {
    id: string;
    type: string;
    valueRange?: Array<number | null>;
    timeRange?: Array<number | null>;
}

export interface IOnlineDataSource extends IDataSource {
    server?: string;
    queryParams?: IQueryParams;
}

export interface ICSVDataSource extends IDataSource {
    property?: string | number | null;
    url?: string;
}

export interface IDateTimeValue {
    timeStamp: string;
    value: number;
}
