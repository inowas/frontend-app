import { EGameObjectType } from './GameObject.type';
import { IParameter } from './Parameter.type';

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
  category?: EGameObjectCategory;
  costs: ICost[];
  editParameters?: IParameter[];
  editPosition?: boolean;
  editSize?: boolean;
  name: EGameObjectType;
}
