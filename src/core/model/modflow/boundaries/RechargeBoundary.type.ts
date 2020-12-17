import {ICells} from '../../geometry/Cells.type';
import {ISpValues} from './Boundary.type';
import {Polygon} from 'geojson';

export type INrchop = 1 | 2 | 3;

export interface IRechargeBoundary {
    id: string;
    type: 'Feature';
    geometry: Polygon;
    properties: {
        type: 'rch';
        name: string;
        cells: ICells;
        layers: number[];
        nrchop: INrchop;
        sp_values: ISpValues;
    };
}

export interface IRechargeBoundaryExport {
    type: 'rch';
    id?: string;
    name: string;
    geometry: Polygon;
    layers: number[];
    cells?: ICells;
    sp_values: ISpValues;
    nrchop: INrchop;
}
