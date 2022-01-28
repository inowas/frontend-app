import { IGameObject } from './GameObject.type';
import { IGridSize } from './Geometry.type';
import { IResourceSettings } from './Resource.type';
import { ITool } from './Tool.type';
import { TObjective } from './Objective.type';

export interface IScenario {
  aim: string[];
  backgroundImage: string;
  description: string;
  gridSize: IGridSize;
  hints: string[];
  modelId: string;
  objectives: TObjective[];
  objects: IGameObject[];
  resources: IResourceSettings[];
  subtitle: string;
  title: string;
  tools: ITool[];
}
