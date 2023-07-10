import {
  ILineBoundaryExport,
  ILineBoundaryFeature,
  ILineBoundaryFeatureCollection,
  ILineBoundaryFeatureProperties,
} from './LineBoundary.type';
import { IObservationPoint } from './ObservationPoint.type';

export interface IConstantHeadBoundary extends ILineBoundaryFeatureCollection {
  type: 'FeatureCollection';
  features: Array<IObservationPoint | IConstantHeadBoundaryFeature>;
}

export interface IConstantHeadBoundaryFeature extends ILineBoundaryFeature {
  properties: IConstantHeadBoundaryFeatureProperties;
}

export interface IConstantHeadBoundaryFeatureProperties extends ILineBoundaryFeatureProperties {
  type: 'chd';
}

export interface IConstantHeadBoundaryExport extends ILineBoundaryExport {
  type: 'chd';
}
