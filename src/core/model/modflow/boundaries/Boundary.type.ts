import {
    IConstantHeadBoundary,
    IConstantHeadBoundaryFeature,
    IConstantHeadBoundaryImport
} from './ConstantHeadBoundary.type';
import {IDrainageBoundary, IDrainageBoundaryFeature, IDrainageBoundaryImport} from './DrainageBoundary.type';
import {
    IEvapotranspirationBoundary,
    IEvapotranspirationBoundaryImport,
} from './EvapotranspirationBoundary.type';
import {
    IGeneralHeadBoundary,
    IGeneralHeadBoundaryFeature,
    IGeneralHeadBoundaryImport
} from './GeneralHeadBoundary.type';
import {IHeadObservationWell, IHeadObservationWellImport} from './HeadObservationWell.type';
import {IObservationPoint} from './ObservationPoint.type';
import {IRechargeBoundary, IRechargeBoundaryImport} from './RechargeBoundary.type';
import {IRiverBoundary, IRiverBoundaryFeature, IRiverBoundaryImport} from './RiverBoundary.type';
import {IWellBoundary, IWellBoundaryImport} from './WellBoundary.type';

export type LineBoundaryType = 'chd' | 'ghb' | 'riv' | 'drn';
export type BoundaryType = 'evt' | 'rch' | 'wel' | 'hob' | LineBoundaryType;

export type IBoundary = IConstantHeadBoundary | IGeneralHeadBoundary | IDrainageBoundary |
    IEvapotranspirationBoundary | IHeadObservationWell | IRechargeBoundary | IRiverBoundary | IWellBoundary;

export type IBoundaryFeature =
    IConstantHeadBoundaryFeature
    | IDrainageBoundaryFeature
    | IGeneralHeadBoundaryFeature
    | IRiverBoundaryFeature;

export type IBoundaryImport =
    IConstantHeadBoundaryImport
    | IDrainageBoundaryImport
    | IGeneralHeadBoundaryImport
    | IRiverBoundaryImport
    | IEvapotranspirationBoundaryImport
    | IHeadObservationWellImport
    | IRechargeBoundaryImport
    | IWellBoundaryImport;

export type BoundarySelection = 'all' | BoundaryType;

export type ISpValues = number[][] | null;

export interface IBoundaryFeatureCollection {
    type: 'FeatureCollection';
    features: Array<IBoundaryFeature | IObservationPoint>;
}

export interface IValueProperty {
    name: string;
    description: string;
    unit: string;
    decimals: number;
    default: number;
}
