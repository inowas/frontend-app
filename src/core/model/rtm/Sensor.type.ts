import {Point} from 'geojson';

export interface ISensor {
    id: string;
    name: string;
    geolocation: Point;
    properties: ISensorProperty[];
}

export interface ISensorProperty {
    id: string;
    name: string;
    dataSource: IDataSource;
    filters: IFilter[];
    data: IDateTimeValue[];
}

export type IFilter = Array<() => void>;

export interface IDataSource {
    type: string;
    server: string | null;
    query: string | null;
}

export interface IDateTimeValue {
    dateTime: string;
    value: number;
}
