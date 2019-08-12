import {Point} from 'geojson';
import {GeoJson} from '../../geometry/Geometry.type';
import {IConstantHeadBoundary, IConstantHeadBoundaryFeature} from './ConstantHeadBoundary.type';
import {IDrainageBoundary, IDrainageBoundaryFeature} from './DrainageBoundary.type';
import {IEvapotranspirationBoundary, INevtop} from './EvapotranspirationBoundary.type';
import {IGeneralHeadBoundary, IGeneralHeadBoundaryFeature} from './GeneralHeadBoundary.type';
import {IHeadObservationWell} from './HeadObservationWell.type';
import {IObservationPoint} from './ObservationPoint.type';
import {INrchop, IRechargeBoundary} from './RechargeBoundary.type';
import {IRiverBoundary, IRiverBoundaryFeature} from './RiverBoundary.type';
import {IWellBoundary, IWellType} from './WellBoundary.type';

export type LineBoundaryType = 'chd' | 'ghb' | 'riv' | 'drn';
export type BoundaryType = 'evt' | 'rch' | 'wel' | 'hob' | LineBoundaryType;

export type IBoundary = IConstantHeadBoundary | IGeneralHeadBoundary | IDrainageBoundary |
    IEvapotranspirationBoundary | IHeadObservationWell | IRechargeBoundary | IRiverBoundary | IWellBoundary;

export type IBoundaryFeature = IConstantHeadBoundaryFeature | IGeneralHeadBoundaryFeature | IDrainageBoundaryFeature |
    IRiverBoundaryFeature;

export interface IBoundaryImportData {
    type: BoundaryType;
    name: string;
    geometry: GeoJson;
    layers: number[];
    sp_values: ISpValues;
    ops: IObservationPointImportData[];
    well_type?: IWellType;
    nevtop?: INevtop;
    nrchop?: INrchop;
}

export type BoundarySelection = 'all' | BoundaryType;

export type ISpValues = number[][] | null;

export interface IBoundaryFeatureCollection {
    type: 'FeatureCollection';
    features: Array<IBoundaryFeature | IObservationPoint>;
}

export interface IObservationPointImportData {
    name: string;
    geometry: Point;
    sp_values: ISpValues;
}

export interface IValueProperty {
    name: string;
    description: string;
    unit: string;
    decimals: number;
    default: number;
}
