import {IPointBoundary, IPointBoundaryExport, IPointBoundaryProperties} from './PointBoundary.type';

export type IWellType = 'puw' | 'inw' | 'iw' | 'irw' | 'opw';

export interface IWellBoundary extends IPointBoundary {
    properties: IWellBoundaryProperties;
}

export interface IWellBoundaryProperties extends IPointBoundaryProperties {
    type: 'wel';
    well_type: IWellType;
}

export interface IWellBoundaryExport extends IPointBoundaryExport {
    type: 'wel';
    well_type: IWellType;
}
