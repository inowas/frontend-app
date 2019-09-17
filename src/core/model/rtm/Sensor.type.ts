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

export type IFilter = () => void;

export interface IQueryParams {
    project: string;
    sensor: string;
    property: string;
    begin?: number;
    end?: number;
}

export interface IDataSource {
    type: string;
    server?: string;
    queryParams?: IQueryParams;
    range?: Array<number | null>;
}

export interface ICSVDataSource extends IDataSource {
    type: string;
    property?: string | number | null;
    url?: string;
}

export interface IDateTimeValue {
    timeStamp: string;
    value: number;
}
