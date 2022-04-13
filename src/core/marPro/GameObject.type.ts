import { BoundaryType } from '../model/modflow/boundaries/Boundary.type';
import { IParameter } from './Parameter.type';
import { ITool } from './Tool.type';
import { IVector2D } from './Geometry.type';

export enum EGameObjectType {
  ABSTRACTION_WELL = 'o_abstraction_well',
  OBSERVATION_WELL = 'o_observation_well',
  INFILTRATION_POND = 'o_infiltration_pond',
  RIVER = 'o_river',
  WASTEWATER_TREATMENT_PLANT = 'o_wtp',
}

export interface IGameObject {
  boundaryId?: string;
  boundaryType?: BoundaryType;
  id: string;
  locationIsFixed?: boolean;
  location: IVector2D;
  parameters: IParameter[];
  size: IVector2D;
  type: EGameObjectType;
}

export interface IDraftGameObject {
  hasBeenPaid: boolean;
  hasBeenPlaced: boolean;
  location: IVector2D;
  tool: ITool;
  type: EGameObjectType;
}
