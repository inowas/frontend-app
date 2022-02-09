import { IVector2D } from './Geometry.type';

export enum EObjectiveType {
  BY_CELLS = 'cells',
  BY_PARAMETER = 'parameter',
  BY_RESOURCE = 'resource',
}

export enum EParameterObjectiveType {
  ABSOLUTE = 'absolute',
  RELATIVE = 'relative',
}

export interface IObjectiveByCells {
  cells: Array<IVector2D | string>;
  parameters: IParameterObjective[];
  type: EObjectiveType.BY_CELLS;
}

export interface IObjectiveByResource {
  max?: number;
  min?: number;
  resourceId: string;
  type: EObjectiveType.BY_RESOURCE;
}

export interface IObjectiveByParameter {
  max?: number;
  min?: number;
  parameterId: string;
  type: EObjectiveType.BY_PARAMETER;
}

export interface IParameterObjective {
  id: string;
  max: number;
  min: number;
  type: EParameterObjectiveType;
}

export type TObjective = IObjectiveByCells | IObjectiveByParameter | IObjectiveByResource;
