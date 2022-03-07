import { BoundaryType } from '../model/modflow/boundaries/Boundary.type';
import { IParameter } from './Parameter.type';
import { IVector2D } from './Geometry.type';

export enum EGameObjectType {
  ABSTRACTION_WELL = 'o_abstraction_well',
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
  image: string;
  location: IVector2D;
  size: IVector2D;
  type: EGameObjectType;
}
