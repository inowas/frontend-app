import {Point} from 'geojson';
import {ICells} from '../../geometry/Cells.type';
import {ISpValues} from './Boundary.type';

export type IWellType = 'puw' | 'inw' | 'iw' | 'irw' | 'opw';

export interface IWellBoundary {
    id: string;
    type: 'Feature';
    geometry: Point;
    properties: {
        type: 'wel';
        name: string;
        cells: ICells
        layers: number[];
        well_type: IWellType;
        sp_values: ISpValues;
    };
}

export interface IWellBoundaryImport {
    type: 'wel';
    name: string;
    geometry: Point;
    layers: number[];
    sp_values: ISpValues;
    well_type: IWellType;
}
