import {ISpValues} from './Boundary.type';
import {Point} from 'geojson';

export interface IObservationPoint {
    type: 'Feature';
    id: string;
    geometry: Point;
    properties: {
        name: string;
        date_times?: string[];
        sp_values: ISpValues;
        type: 'op';
        distance: number;
    };
}

export interface IObservationPointExport {
    id?: string;
    name: string;
    geometry: Point;
    date_times?: string[];
    sp_values: ISpValues;
}
