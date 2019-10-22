import {
    ILineBoundaryExport,
    ILineBoundaryFeature,
    ILineBoundaryFeatureCollection,
    ILineBoundaryFeatureProperties
} from './LineBoundary.type';
import {IObservationPoint} from './ObservationPoint.type';

export interface IRiverBoundary extends ILineBoundaryFeatureCollection {
    type: 'FeatureCollection';
    features: Array<IObservationPoint | IRiverBoundaryFeature>;
}

export interface IRiverBoundaryFeature extends ILineBoundaryFeature {
    properties: IRiverBoundaryFeatureProperties;
}

interface IRiverBoundaryFeatureProperties extends ILineBoundaryFeatureProperties {
    type: 'riv';
}

export interface IRiverBoundaryExport extends ILineBoundaryExport {
    type: 'riv';
}
