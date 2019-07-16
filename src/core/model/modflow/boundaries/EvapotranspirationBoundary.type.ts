import {MultiPolygon, Polygon} from 'geojson';
import Cells from '../../geometry/Cells';
import {IBoundaryFeature, SpValues} from './types';

export interface IEvapotranspirationBoundary extends IBoundaryFeature {
    type: 'Feature';
    id: string;
    geometry?: Polygon | MultiPolygon;
    properties: {
        name?: string;
        type: 'evt';
        layers?: number[];
        cells?: Cells;
        nevtop?: number;
        sp_values?: SpValues;
    };
}
