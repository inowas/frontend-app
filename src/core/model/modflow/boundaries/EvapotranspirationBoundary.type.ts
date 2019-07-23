import {MultiPolygon, Polygon} from 'geojson';
import {Cell} from '../../geometry/types';
import {IBoundaryFeature, SpValues} from './types';

export interface IEvapotranspirationBoundary extends IBoundaryFeature {
    type: 'Feature';
    id: string;
    geometry?: Polygon | MultiPolygon;
    properties: {
        name?: string;
        type: 'evt';
        layers?: number[];
        cells?: Cell[];
        nevtop?: number;
        sp_values?: SpValues;
    };
}
