import {Point} from 'geojson';
import {ICells} from '../../geometry/Cells.type';
import {ISpValues} from './Boundary.type';
import {IPointBoundaryExport} from './PointBoundary.type';

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

export interface IWellBoundaryExport extends IPointBoundaryExport {
    type: 'wel';
    well_type: IWellType;
}
