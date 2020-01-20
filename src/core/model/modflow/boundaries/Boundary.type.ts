import {
    IConstantHeadBoundary,
    IConstantHeadBoundaryExport,
    IConstantHeadBoundaryFeature
} from './ConstantHeadBoundary.type';
import {IDrainageBoundary, IDrainageBoundaryExport, IDrainageBoundaryFeature} from './DrainageBoundary.type';
import {
    IEvapotranspirationBoundary,
    IEvapotranspirationBoundaryExport,
} from './EvapotranspirationBoundary.type';
import {
    IFlowAndHeadBoundary,
    IFlowAndHeadBoundaryExport,
    IFlowAndHeadBoundaryFeature
} from './FlowAndHeadBoundary.type';
import {
    IGeneralHeadBoundary,
    IGeneralHeadBoundaryExport,
    IGeneralHeadBoundaryFeature
} from './GeneralHeadBoundary.type';
import {IHeadObservationWell, IHeadObservationWellExport} from './HeadObservationWell.type';
import {LineBoundaryType} from './LineBoundary.type';
import {IRechargeBoundary, IRechargeBoundaryExport} from './RechargeBoundary.type';
import {IRiverBoundary, IRiverBoundaryExport, IRiverBoundaryFeature} from './RiverBoundary.type';
import {IWellBoundary, IWellBoundaryExport} from './WellBoundary.type';

export type BoundaryType = 'evt' | 'rch' | 'wel' | 'hob' | 'lak' | LineBoundaryType;

export type IBoundary = IConstantHeadBoundary | IGeneralHeadBoundary | IDrainageBoundary | IEvapotranspirationBoundary |
    IFlowAndHeadBoundary | IHeadObservationWell | IRechargeBoundary | IRiverBoundary | IWellBoundary;

export type IBoundaryFeature =
    IConstantHeadBoundaryFeature
    | IDrainageBoundaryFeature
    | IGeneralHeadBoundaryFeature
    | IFlowAndHeadBoundaryFeature
    | IRiverBoundaryFeature;

export type IBoundaryExport =
    IConstantHeadBoundaryExport
    | IDrainageBoundaryExport
    | IGeneralHeadBoundaryExport
    | IRiverBoundaryExport
    | IFlowAndHeadBoundaryExport
    | IEvapotranspirationBoundaryExport
    | IHeadObservationWellExport
    | IRechargeBoundaryExport
    | IWellBoundaryExport;

export type BoundarySelection = 'all' | BoundaryType;

export type ISpValues = number[][];

export interface IValueProperty {
    name: string;
    description: string;
    unit: string;
    decimals: number;
    default: number;
    canBeDisabled?: boolean;
}
