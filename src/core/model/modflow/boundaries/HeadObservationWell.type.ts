import { IPointBoundary, IPointBoundaryExport, IPointBoundaryProperties } from './PointBoundary.type';

export interface IHeadObservationWell extends IPointBoundary {
  properties: IHeadObservationWellProperties;
}

export interface IHeadObservationWellProperties extends IPointBoundaryProperties {
  date_times: string[];
  type: 'hob';
}

export interface IHeadObservationWellExport extends IPointBoundaryExport {
  date_times: string[];
  type: 'hob';
}
