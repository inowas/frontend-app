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

export const gameObjectTypes = [
  { type: EGameObjectType.ABSTRACTION_WELL, size: { x: 44, y: 30 } },
  { type: EGameObjectType.INFILTRATION_POND, size: { x: 44, y: 30 } },
  { type: EGameObjectType.OBSERVATION_WELL, size: { x: 44, y: 30 } },
  { type: EGameObjectType.RIVER, size: { x: 825, y: 664 } },
  { type: EGameObjectType.WASTEWATER_TREATMENT_PLANT, size: { x: 130, y: 90 } },
];

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
