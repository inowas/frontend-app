import {MultiPolygon, Polygon} from 'geojson';
import {ICells} from '../../geometry/Cells.type';
import {IBoundaryFeature, SpValues} from './types';

export interface IRechargeBoundary extends IBoundaryFeature {
    id: string;
    geometry?: Polygon | MultiPolygon;
    properties: {
        name?: string;
        layers?: number[];
        cells?: ICells;
        sp_values?: SpValues;
        nrchop: number;
        type: 'rch';
    };
}
