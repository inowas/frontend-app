import { IParameter } from './Parameter.type';
import { IVector2D } from './Geometry.type';

export enum EGameObjectType {
  ABSTRACTION_WELL = 'o_abstraction_well',
  INFILTRATION_POND = 'o_infiltration_pond',
  RIVER = 'o_river',
}

export interface IGameObject {
  boundaryId?: string;
  id: string;
  type: EGameObjectType;
  location: IVector2D;
  size: IVector2D;
  parameters: IParameter[];
}
