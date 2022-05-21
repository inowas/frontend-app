import { EBoundaryType } from '../model/modflow/boundaries/Boundary.type';
import { IParameter } from './Parameter.type';
import { IVector2D } from './Geometry.type';

export enum EGameObjectCategory {
  LANDUSE = 'landuse',
  STRUCTURES = 'structures',
}

export const toolCategories = [EGameObjectCategory.LANDUSE, EGameObjectCategory.STRUCTURES];

export interface ICost {
  id: string;
  amount: number;
  refund?: number;
  resource: string;
}

export interface ITool {
  id: string;
  boundaryType?: EBoundaryType;
  category?: EGameObjectCategory;
  costs: ICost[];
  editPosition?: boolean;
  editSize?: boolean;
  name: string;
  parameters: IParameter[];
  size: IVector2D;
}
