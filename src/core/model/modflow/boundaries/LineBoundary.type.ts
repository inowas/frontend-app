import {LineString} from 'geojson';
import {Cell} from '../../geometry/types';
import {IObservationPoint} from './ObservationPoint.type';
import {IBoundaryFeature, IBoundaryFeatureCollection, LineBoundaryType} from './types';

export interface ILineBoundaryFeature extends IBoundaryFeature {
    type: 'Feature';
    id: string;
    geometry?: LineString;
    properties: {
        name?: string;
        layers?: number[];
        type: LineBoundaryType;
        cells?: Cell[];
    };
}

export interface ILineBoundary extends IBoundaryFeatureCollection {
    type: 'FeatureCollection';
    features: Array<IObservationPoint | ILineBoundaryFeature>;
}
