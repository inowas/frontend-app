import {IPointBoundary, IPointBoundaryExport, IPointBoundaryProperties} from './PointBoundary.type';

export interface IHeadObservationWell extends IPointBoundary {
    properties: IHeadObservationWellProperties;
}

export interface IHeadObservationWellProperties extends IPointBoundaryProperties {
    type: 'hob';
}

export interface IHeadObservationWellExport extends IPointBoundaryExport {
    type: 'hob';
}
