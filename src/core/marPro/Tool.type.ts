export enum EGameObjectCategory {
  LANDUSE = 'landuse',
  STRUCTURES = 'structures',
}

export interface ITool {
  category?: EGameObjectCategory;
  editParameters?: string[];
  editPosition?: boolean;
  editSize?: boolean;
  name: string;
}
