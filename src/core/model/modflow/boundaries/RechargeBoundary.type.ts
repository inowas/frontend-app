import {MultiPolygon, Polygon} from 'geojson';
import {Cell} from '../../geometry/types';
import {IBoundaryFeature, SpValues} from './types';

export interface IRechargeBoundary extends IBoundaryFeature {
    id: string;
    geometry?: Polygon | MultiPolygon;
    properties: {
        name?: string;
        layers?: number[];
        cells?: Cell[];
        sp_values?: SpValues;
        type: 'rch';
    };
}
