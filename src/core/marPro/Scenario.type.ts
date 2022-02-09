import { IGameObject } from './GameObject.type';
import { IResourceSettings } from './Resource.type';
import { ITool } from './Tool.type';
import { IVector2D } from './Geometry.type';
import { TObjective } from './Objective.type';

export interface IScenario {
  aim: string[];
  backgroundImage: string;
  description: string;
  gridReferencePoint: IVector2D;
  gridSize: IVector2D;
  hints: string[];
  modelId: string;
  objectives: TObjective[];
  objects: IGameObject[];
  resources: IResourceSettings[];
  subtitle: string;
  stageSize: {
    x: number;
    y: number;
  };
  title: string;
  tools: ITool[];
}
