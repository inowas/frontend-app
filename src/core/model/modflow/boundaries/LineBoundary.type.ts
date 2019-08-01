import {LineString} from 'geojson';
import {ICells} from '../../geometry/Cells.type';
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
        cells?: ICells;
    };
}

export interface ILineBoundary extends IBoundaryFeatureCollection {
    type: 'FeatureCollection';
    features: Array<IObservationPoint | ILineBoundaryFeature>;
}
