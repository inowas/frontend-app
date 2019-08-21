import {Point} from '../geometry/Cells.type';

export interface ISensor {
    id: string;
    name: string;
    geolocation: Point | null;
    properties: ISensorProperty[];
}

export interface ISensorProperty {
    name: string;
    dataSource: IDataSource;
    filters: Array<() => void>;
    data: IDateTimeValue[];
}

export interface IDataSource {
    type: string;
    server: string | null;
    query: string | null;
}

export interface IDateTimeValue {
    dateTime: string;
    value: number;
}
