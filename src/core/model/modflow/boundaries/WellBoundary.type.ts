import {Point} from 'geojson';
import {ICells} from '../../geometry/Cells.type';
import {IBoundaryFeature, SpValues, WellType} from './types';

export interface IWellBoundary extends IBoundaryFeature {
    type: 'Feature';
    id: string;
    geometry?: Point;
    properties: {
        name?: string;
        type: 'wel';
        layers?: number[];
        cells?: ICells
        well_type?: WellType;
        sp_values?: SpValues;
    };
}
