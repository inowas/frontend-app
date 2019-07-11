import {LineString} from 'geojson';
import Cells from '../../geometry/Cells';
import {IObservationPoint} from './ObservationPoint.type';
import {IBoundaryFeature, IBoundaryFeatureCollection} from './types';

export type LineBoundaryType = 'chd' | 'ghb' | 'riv' | 'drn';

export interface ILineBoundaryFeature extends IBoundaryFeature {
    type: 'Feature';
    id: string;
    geometry?: LineString;
    properties: {
        name?: string;
        layers?: number[];
        type: LineBoundaryType | 'op' | '';
        cells?: Cells;
    };
}

export interface ILineBoundary extends IBoundaryFeatureCollection {
    type: 'FeatureCollection';
    features: Array<IObservationPoint | ILineBoundaryFeature>;
}
