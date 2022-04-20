import { ICell } from '../model/geometry/Cells.type';
import { IVector2D } from './Geometry.type';

export const checkObjective = (objectiveState: IObjectiveState) => {
  return objectiveState.value === undefined
    ? false
    : (objectiveState.objective.min === undefined ||
        (objectiveState.objective.min !== undefined && objectiveState.value >= objectiveState.objective.min)) &&
        (objectiveState.objective.max === undefined ||
          (objectiveState.objective.max !== undefined && objectiveState.value <= objectiveState.objective.max));
};

export enum EObjectiveType {
  BY_OBSERVATION = 'observation',
  BY_PARAMETER = 'parameter',
  BY_RESOURCE = 'resource',
}

export enum EParameterObjectiveType {
  ABSOLUTE = 'absolute',
  RELATIVE = 'relative',
}

export interface IObjectiveByObservation {
  cell: ICell;
  max: number;
  min: number;
  parameter: string;
  position: IVector2D;
  type: EObjectiveType.BY_OBSERVATION;
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

export interface IObjectiveState {
  objective: TObjective;
  isAchieved: boolean;
  tries: number;
  value?: number;
}

export type TObjective = IObjectiveByObservation | IObjectiveByParameter | IObjectiveByResource;
