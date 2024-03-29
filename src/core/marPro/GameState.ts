import { GenericObject } from '../model/genericObject/GenericObject';
import { ICost } from './Tool.type';
import { IGameObject } from './GameObject.type';
import { IGameState } from './GameState.type';
import { cloneDeep } from 'lodash';
import GameObject from './GameObject';
import Scenario from './Scenario';
import uuid from 'uuid';

class GameState extends GenericObject<IGameState> {
  get id() {
    return this._props.id;
  }

  get modelId() {
    return this._props.modelId;
  }

  set modelId(value: string | null) {
    this._props.modelId = value;
  }

  get objectives() {
    return this._props.objectives;
  }

  get objects() {
    return this._props.objects;
  }

  set objects(value: IGameObject[]) {
    this._props.objects = value;
  }

  get resources() {
    return this._props.resources;
  }

  get scenarioId() {
    return this._props.scenarioId;
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
      id: uuid.v4(),
      dialogs: [],
      modelId: null,
      objectives: scenario.objectives.map((objective) => {
        return {
          objective: cloneDeep(objective),
          isAchieved: false,
          tries: 0,
        };
      }),
      objects: cloneDeep(scenario.objects),
      playerId: 'player_001',
      resources: scenario.resources.map((res) => {
        return {
          id: res.id,
          value: res.startValue,
        };
      }),
      scenarioId: scenario.id,
    });
  }

  public addGameObject(g: GameObject) {
    this._props.objects = [...this._props.objects, g.toObject()];
    return this;
  }

  public refundResource(cost: ICost) {
    this._props.resources = this._props.resources.map((r) => {
      if (r.id === cost.resource && cost.refund && cost.refund !== 0) {
        r.value = r.value + cost.refund;
      }
      return r;
    });
    return this;
  }

  public removeGameObject(g: GameObject) {
    this._props.objects = this._props.objects.filter((o) => o.id !== g.id);
    return this;
  }

  public toToolInstance() {
    return {
      id: this._props.id,
      name: this._props.scenarioId,
      data: this._props,
      description: '',
      permissions: 'rwx',
      public: false,
      tool: 'marpro',
    };
  }

  public updateGameObject(object: GameObject) {
    this._props.objects = this._props.objects.map((o) => {
      if (o.id === object.id) {
        return object.toObject();
      }
      return o;
    });
    return this;
  }

  public updateResource(cost: ICost) {
    this._props.resources = this._props.resources.map((r) => {
      if (r.id === cost.resource) {
        r.value = r.value - cost.amount;
      }
      return r;
    });
    return this;
  }

  public updateResources(costs: ICost[]) {
    costs.forEach((cost) => this.updateResource(cost));
  }
}

export default GameState;
