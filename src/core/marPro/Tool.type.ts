import { EBoundaryType } from '../model/modflow/boundaries/Boundary.type';
import { EGameObjectType } from './GameObject.type';
import { IParameter } from './Parameter.type';
import { IVector2D } from './Geometry.type';

export enum EGameObjectCategory {
  LANDUSE = 'landuse',
  STRUCTURES = 'structures',
}

export interface ICost {
  amount: number;
  refund?: number;
  resource: string;
}

export interface ITool {
  boundaryType?: EBoundaryType;
  category?: EGameObjectCategory;
  costs: ICost[];
  editParameters?: IParameter[];
  editPosition?: boolean;
  editSize?: boolean;
  name: EGameObjectType;
  size: IVector2D;
}
