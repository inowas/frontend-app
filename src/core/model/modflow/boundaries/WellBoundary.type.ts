import {Point} from 'geojson';
import {Cell} from '../../geometry/types';
import {IBoundaryFeature, SpValues, WellType} from './types';

export interface IWellBoundary extends IBoundaryFeature {
    type: 'Feature';
    id: string;
    geometry?: Point;
    properties: {
        name?: string;
        type: 'wel';
        layers?: number[];
        cells?: Cell[];
        well_type?: WellType;
        sp_values?: SpValues;
    };
}
