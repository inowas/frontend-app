import {
    ILineBoundaryExport,
    ILineBoundaryFeature,
    ILineBoundaryFeatureCollection,
    ILineBoundaryFeatureProperties
} from './LineBoundary.type';
import {IObservationPoint} from './ObservationPoint.type';

export interface IFlowAndHeadBoundary extends ILineBoundaryFeatureCollection {
    type: 'FeatureCollection';
    features: Array<IObservationPoint | IFlowAndHeadBoundaryFeature>;
}

export interface IFlowAndHeadBoundaryFeature extends ILineBoundaryFeature {
    properties: IFlowAndHeadBoundaryFeatureFeatureProperties;
}

export interface IFlowAndHeadBoundaryFeatureFeatureProperties extends ILineBoundaryFeatureProperties {
    type: 'fhb';
    sp_values_enabled: boolean[];
}

export interface IFlowAndHeadBoundaryExport extends ILineBoundaryExport {
    type: 'fhb';
}
