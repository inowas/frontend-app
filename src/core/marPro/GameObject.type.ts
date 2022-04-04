import { BoundaryType } from '../model/modflow/boundaries/Boundary.type';
import { IParameter } from './Parameter.type';
import { IVector2D } from './Geometry.type';

export enum EGameObjectType {
  ABSTRACTION_WELL = 'Abstraction Well',
  INFILTRATION_POND = 'Infiltration Pond',
  RIVER = 'River',
}

export interface IGameObject {
  boundaryId?: string;
  boundaryType?: BoundaryType;
  id: string;
  type: EGameObjectType;
  location: IVector2D;
  size: IVector2D;
  parameters: IParameter[];
}

export interface IDraftGameObject {
  hasBeenPaid: boolean;
  hasBeenPlaced: boolean;
  image: string;
  location: IVector2D;
  size: IVector2D;
  type: EGameObjectType;
}
