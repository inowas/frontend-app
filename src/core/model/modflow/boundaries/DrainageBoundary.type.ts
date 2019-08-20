import {
    ILineBoundaryExport,
    ILineBoundaryFeature,
    ILineBoundaryFeatureCollection,
    ILineBoundaryFeatureProperties
} from './LineBoundary.type';
import {IObservationPoint} from './ObservationPoint.type';

export interface IDrainageBoundary extends ILineBoundaryFeatureCollection {
    type: 'FeatureCollection';
    features: Array<IObservationPoint | IDrainageBoundaryFeature>;
}

export interface IDrainageBoundaryFeature extends ILineBoundaryFeature {
    properties: IDrainageBoundaryFeatureProperties;
}

export interface IDrainageBoundaryFeatureProperties extends ILineBoundaryFeatureProperties {
    type: 'drn';
}

export interface IDrainageBoundaryExport extends ILineBoundaryExport {
    type: 'drn';
}
