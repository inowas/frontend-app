import {Point} from 'geojson';
import {ICells} from '../../geometry/Cells.type';
import {ISpValues} from './Boundary.type';

export interface IHeadObservationWell {
    id: string;
    type: 'Feature';
    geometry: Point;
    properties: {
        type: 'hob';
        name: string;
        layers: number[];
        cells: ICells;
        sp_values: ISpValues;
    };
}

export interface IHeadObservationWellExport {
    type: 'hob';
    id?: string;
    name: string;
    geometry: Point;
    layers: number[];
    cells?: ICells;
    sp_values: ISpValues;
}
