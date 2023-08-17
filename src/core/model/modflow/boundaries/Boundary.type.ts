import {
  IConstantHeadBoundary,
  IConstantHeadBoundaryExport,
  IConstantHeadBoundaryFeature,
} from './ConstantHeadBoundary.type';
import { IDrainageBoundary, IDrainageBoundaryExport, IDrainageBoundaryFeature } from './DrainageBoundary.type';
import {
  IEvapotranspirationBoundary,
  IEvapotranspirationBoundaryExport,
} from './EvapotranspirationBoundary.type';
import {
  IFlowAndHeadBoundary,
  IFlowAndHeadBoundaryExport,
  IFlowAndHeadBoundaryFeature,
} from './FlowAndHeadBoundary.type';
import {
  IGeneralHeadBoundary,
  IGeneralHeadBoundaryExport,
  IGeneralHeadBoundaryFeature,
} from './GeneralHeadBoundary.type';
import { IHeadObservationWell, IHeadObservationWellExport } from './HeadObservationWell.type';
import { ILakeBoundary, ILakeBoundaryExport } from './LakeBoundary.type';
import { IRechargeBoundary, IRechargeBoundaryExport } from './RechargeBoundary.type';
import { IRiverBoundary, IRiverBoundaryExport, IRiverBoundaryFeature } from './RiverBoundary.type';
import { IWellBoundary, IWellBoundaryExport } from './WellBoundary.type';
import { LineBoundaryType } from './LineBoundary.type';

export type BoundaryType = 'evt' | 'rch' | 'wel' | 'hob' | 'lak' | LineBoundaryType;

export type IBoundary = IConstantHeadBoundary | IGeneralHeadBoundary | IDrainageBoundary | IEvapotranspirationBoundary |
  IFlowAndHeadBoundary | IHeadObservationWell | ILakeBoundary | IRechargeBoundary | IRiverBoundary | IWellBoundary;

export type IBoundaryFeature =
  IConstantHeadBoundaryFeature
  | IDrainageBoundaryFeature
  | IGeneralHeadBoundaryFeature
  | IFlowAndHeadBoundaryFeature
  | IRiverBoundaryFeature;

export type IBoundaryExport =
  IConstantHeadBoundaryExport
  | IDrainageBoundaryExport
  | IEvapotranspirationBoundaryExport
  | IFlowAndHeadBoundaryExport
  | IGeneralHeadBoundaryExport
  | IHeadObservationWellExport
  | ILakeBoundaryExport
  | IRechargeBoundaryExport
  | IRiverBoundaryExport
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

export enum EBoundaryType {
  CHD = 'chd',
  DRN = 'drn',
  EVT = 'evt',
  FHB = 'fhb',
  GHB = 'ghb',
  HOB = 'hob',
  LAK = 'lak',
  RCH = 'rch',
  RIV = 'riv',
  WEL = 'wel'
}
