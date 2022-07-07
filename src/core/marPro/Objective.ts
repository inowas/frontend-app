import { EGameObjectType } from './GameObject.type';
import { EObjectiveType, IObjectiveByObservation, TObjective } from './Objective.type';
import { GenericObject } from '../model/genericObject/GenericObject';
import { IGameState } from './GameState.type';
import GameObject from './GameObject';
import uuid from 'uuid';

class Objective extends GenericObject<TObjective> {
  get id() {
    return this._props.id;
  }

  set id(value: string) {
    this._props.id = value;
  }

  get max() {
    return this._props.max;
  }

  get min() {
    return this._props.min;
  }

  get type() {
    return this._props.type;
  }

  public static fromType(type: string, id: string) {
    if (type === EObjectiveType.BY_PARAMETER) {
      return new Objective({
        id: uuid.v4(),
        parameterId: id,
        type: EObjectiveType.BY_PARAMETER,
      });
    }
    if (type === EObjectiveType.BY_RESOURCE) {
      return new Objective({
        id: uuid.v4(),
        resourceId: id,
        type: EObjectiveType.BY_RESOURCE,
      });
    }
    return new Objective({
      cell: [0, 0],
      id: uuid.v4(),
      max: 0,
      min: 0,
      parameter: id,
      position: { x: 0, y: 0 },
      type: EObjectiveType.BY_OBSERVATION,
    });
  }

  public static fromObject(objective: TObjective) {
    return new Objective(objective);
  }

  public check(gameState: IGameState) {
    const objective = this._props;
    let check = true;
    let value: number | undefined = undefined;
    if (objective.type === EObjectiveType.BY_OBSERVATION) {
      check = false;
    }
    if (objective.type === EObjectiveType.BY_PARAMETER) {
      let sum = 0;
      gameState.objects.forEach((o) => {
        const p = o.parameters.filter((fp) => fp.id === objective.parameterId);
        if (p.length > 0 && typeof p[0].value === 'number') {
          // TODO: multiple timesteps
          sum += p[0].value;
        }
      });
      if (objective.min !== undefined) {
        check = sum >= objective.min;
      }
      if (objective.max !== undefined) {
        check = sum <= objective.max;
      }
      value = sum;
    }
    if (objective.type === EObjectiveType.BY_RESOURCE) {
      const res = gameState.resources.filter((r) => r.id === objective.resourceId);
      if (res.length > 0) {
        value = res[0].value;
        if (objective.min !== undefined) {
          check = res[0].value >= objective.min;
        }
        if (objective.max !== undefined) {
          check = res[0].value <= objective.max;
        }
      }
    }
    return { check, value };
  }

  public toGameObject() {
    if (this.type !== EObjectiveType.BY_OBSERVATION) {
      return null;
    }
    const o = this._props as IObjectiveByObservation;
    return GameObject.fromObject({
      id: `${this.id}_as_object`,
      location: o.position,
      parameters: [],
      size: { x: 44, y: 30 },
      type: EGameObjectType.OBSERVATION_WELL,
    });
  }
}

export default Objective;
