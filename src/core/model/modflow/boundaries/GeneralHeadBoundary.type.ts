import {
    ILineBoundaryExport,
    ILineBoundaryFeature,
    ILineBoundaryFeatureCollection,
    ILineBoundaryFeatureProperties
} from './LineBoundary.type';
import {IObservationPoint} from './ObservationPoint.type';

export interface IGeneralHeadBoundary extends ILineBoundaryFeatureCollection {
    type: 'FeatureCollection';
    features: Array<IObservationPoint | IGeneralHeadBoundaryFeature>;
}

export interface IGeneralHeadBoundaryFeature extends ILineBoundaryFeature {
    properties: IGeneralHeadBoundaryFeatureProperties;
}

export interface IGeneralHeadBoundaryFeatureProperties extends ILineBoundaryFeatureProperties {
    type: 'ghb';
}

export interface IGeneralHeadBoundaryExport extends ILineBoundaryExport {
    type: 'ghb';
}
