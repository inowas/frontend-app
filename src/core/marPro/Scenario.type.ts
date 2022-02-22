import { IGameObject } from './GameObject.type';
import { IResourceSettings } from './Resource.type';
import { ITool } from './Tool.type';
import { IVector2D } from './Geometry.type';
import { TObjective } from './Objective.type';

export interface IScenario {
  aim: string[];
  backgroundImage: string;
  description: string;
  gridSize: IVector2D;
  hints: string[];
  modelId: string;
  objectives: TObjective[];
  objects: IGameObject[];
  referencePoints: Array<[number, number]>;
  resources: IResourceSettings[];
  subtitle: string;
  stageSize: {
    x: number;
    y: number;
  };
  title: string;
  tools: ITool[];
}
