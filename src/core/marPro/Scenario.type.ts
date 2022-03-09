import { IGameObject } from './GameObject.type';
import { IResourceSettings } from './Resource.type';
import { ITool } from './Tool.type';
import { IVector2D } from './Geometry.type';
import { TObjective } from './Objective.type';
import IZone from './Zone.type';

export interface IScenarioSettings {
  allowGameObjectsOnlyInZones?: boolean;
}

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
  settings: IScenarioSettings;
  subtitle: string;
  stageSize: {
    x: number;
    y: number;
  };
  title: string;
  tools: ITool[];
  zones: IZone[];
}
