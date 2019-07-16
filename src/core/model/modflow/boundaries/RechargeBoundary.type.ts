import {MultiPolygon, Polygon} from 'geojson';
import Cells from '../../geometry/Cells';
import {IBoundaryFeature, SpValues} from './types';

export interface IRechargeBoundary extends IBoundaryFeature {
    id: string;
    geometry?: Polygon | MultiPolygon;
    properties: {
        name?: string;
        layers?: number[];
        cells?: Cells;
        sp_values?: SpValues;
        type: 'rch';
    };
}
