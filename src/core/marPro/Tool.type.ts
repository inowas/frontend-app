import { EGameObjectType } from './GameObject.type';

export enum EGameObjectCategory {
  LANDUSE = 'landuse',
  STRUCTURES = 'structures',
}

export interface ICost {
  amount: number;
  resource: string;
}

export interface ITool {
  category?: EGameObjectCategory;
  cost?: ICost;
  editParameters?: string[];
  editPosition?: boolean;
  editSize?: boolean;
  name: EGameObjectType;
}
