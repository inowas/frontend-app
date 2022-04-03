import { IDialog } from './DIalog.type';
import { IGameObject } from './GameObject.type';
import { IResource } from './Resource.type';
import { ISimpleTool } from '../model/types';

export interface IGameState {
  id: string;
  dialogs: IDialog[];
  modelId: string | null;
  objects: IGameObject[];
  playerId: string;
  resources: IResource[];
  scenarioId: string;
}

export interface IGameStateSimpleTool extends ISimpleTool<IGameState> {
  data: IGameState;
}
