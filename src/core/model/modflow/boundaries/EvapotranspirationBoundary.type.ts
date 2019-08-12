import {Polygon} from 'geojson';
import {ICells} from '../../geometry/Cells.type';
import {ISpValues} from './Boundary.type';

export type INevtop = number;

export interface IEvapotranspirationBoundary {
    id: string;
    type: 'Feature';
    geometry: Polygon;
    properties: {
        type: 'evt';
        name: string;
        cells: ICells;
        layers: number[];
        nevtop: INevtop;
        sp_values: ISpValues;
    };
}

export interface IEvapotranspirationBoundaryImport {
    type: 'evt';
    name: string;
    geometry: Polygon;
    layers: number[];
    sp_values: ISpValues;
    nevtop: INevtop;
}
