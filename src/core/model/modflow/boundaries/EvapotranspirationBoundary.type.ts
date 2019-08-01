import {MultiPolygon, Polygon} from 'geojson';
import {ICells} from '../../geometry/Cells.type';
import {IBoundaryFeature, SpValues} from './types';

export interface IEvapotranspirationBoundary extends IBoundaryFeature {
    type: 'Feature';
    id: string;
    geometry?: Polygon | MultiPolygon;
    properties: {
        name?: string;
        type: 'evt';
        layers?: number[];
        cells?: ICells;
        nevtop?: number;
        sp_values?: SpValues;
    };
}
