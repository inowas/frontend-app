import { GenericObject } from '../model/genericObject/GenericObject';
import { ICost } from './Tool.type';
import { IGameObject } from './GameObject.type';
import { IGameState } from './GameState.type';
import { cloneDeep } from 'lodash';
import GameObject from './GameObject';
import Scenario from './Scenario';

class GameState extends GenericObject<IGameState> {
  get objects() {
    return this._props.objects;
  }

  set objects(value: IGameObject[]) {
    this._props.objects = value;
  }

  public getResource(id: string) {
    const res = this._props.resources.filter((r) => r.id === id);
    if (res.length > 0) {
      return res[0].value;
    }
    return 0;
  }

  public static fromObject(value: IGameState) {
    return new GameState(value);
  }

  public static fromScenario(scenario: Scenario) {
    return new GameState({
      dialogs: [],
      objects: cloneDeep(scenario.objects),
      playerId: 'player_001',
      resources: scenario.resources.map((res) => {
        return {
          id: res.id,
          value: res.startValue,
        };
      }),
      scenarioId: 'scenario_001',
    });
  }

  public addGameObject = (g: GameObject) => {
    this._props.objects = [...this._props.objects, g.toObject()];
    return this;
  };

  public updateResource = (cost: ICost) => {
    this._props.resources = this._props.resources.map((r) => {
      if (r.id === cost.resource) {
        r.value = r.value - cost.amount;
      }
      return r;
    });
    return this;
  };
}

export default GameState;
