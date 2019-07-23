import {Point} from 'geojson';
import {GeoJson} from '../../geometry/Geometry';
import {ILineBoundary} from './LineBoundary.type';

export type LineBoundaryType = 'chd' | 'ghb' | 'riv' | 'drn';

export type BoundaryType = 'evt' | 'rch' | 'wel' | 'hob' | LineBoundaryType;

export type BoundarySelection = 'all' | BoundaryType;

export type WellType = 'puw' | 'inw' | 'iw' | 'irw' | 'opw';

export type SpValues = number[][] | null;

export interface IBoundaryFeature {
    type: 'Feature';
    id: string;
    geometry?: GeoJson;
    properties: {
        type: BoundaryType | 'op' | '';
    };
}

export interface IBoundaryFeatureCollection {
    type: 'FeatureCollection';
    features: IBoundaryFeature[];
}

export type BoundaryInstance = IBoundaryFeature | ILineBoundary;

export interface IObservationPointImport {
    name: string;
    geometry: Point;
    sp_values: SpValues;
}

export interface IBoundaryImport {
    type: BoundaryType;
    name: string;
    geometry: GeoJson;
    layers: number[];
    sp_values: SpValues;
    ops?: IObservationPointImport[];
    well_type?: WellType;
}
