import { IDialog } from './DIalog.type';
import { IGameObject } from './GameObject.type';
import { IResource } from './Resource.type';

export interface IGameState {
  dialogs: IDialog[];
  objects: IGameObject[];
  playerId: string;
  resources: IResource[];
  scenarioId: string;
}
