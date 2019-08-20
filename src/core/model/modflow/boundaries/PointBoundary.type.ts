import {Point} from 'geojson';
import {ICells} from '../../geometry/Cells.type';
import {ISpValues} from './Boundary.type';

export interface IPointBoundary {
    id: string;
    type: 'Feature';
    geometry: Point;
    properties: IPointBoundaryProperties;
}

export interface IPointBoundaryProperties {
    name: string;
    cells: ICells;
    layers: number[];
    sp_values: ISpValues;
}

export interface IPointBoundaryExport {
    id?: string;
    name: string;
    geometry: Point;
    layers: number[];
    cells?: ICells;
    sp_values: ISpValues;
}
