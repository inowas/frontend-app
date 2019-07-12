import {Point} from 'geojson';
import Cells from '../../geometry/Cells';
import {IBoundaryFeature, SpValues, WellType} from './types';

export interface IWellBoundary extends IBoundaryFeature {
    type: 'Feature';
    id: string;
    geometry?: Point;
    properties: {
        name?: string;
        type: 'wel';
        layers?: number[];
        cells?: Cells;
        well_type?: WellType;
        sp_values?: SpValues;
    };
}
