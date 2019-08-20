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

export interface IEvapotranspirationBoundaryExport {
    type: 'evt';
    id?: string;
    name: string;
    geometry: Polygon;
    layers: number[];
    cells?: ICells;
    sp_values: ISpValues;
    nevtop: INevtop;
}
