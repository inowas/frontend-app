import { EObjectiveType, TObjective } from './Objective.type';
import { GenericObject } from '../model/genericObject/GenericObject';
import { IGameState } from './GameState.type';

class Objective extends GenericObject<TObjective> {
  get id() {
    return this._props.id;
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

  public static fromObject(objective: TObjective) {
    return new Objective(objective);
  }

  public check(gameState: IGameState, onSendDebugMessage?: (message: string) => void) {
    const objective = this._props;
    let check = true;
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
        !!onSendDebugMessage &&
          onSendDebugMessage(
            `Check objective: Parameter ${objective.parameterId} ${sum} >= ${objective.min} -> ${sum >= objective.min}`
          );
        check = sum >= objective.min;
      }
      if (objective.max !== undefined) {
        !!onSendDebugMessage &&
          onSendDebugMessage(
            `Check objective: Parameter ${objective.parameterId} ${sum} <= ${objective.min} -> ${sum <= objective.max}`
          );
        check = sum <= objective.max;
      }
    }
    if (objective.type === EObjectiveType.BY_RESOURCE) {
      const res = gameState.resources.filter((r) => r.id === objective.resourceId);
      if (res.length > 0) {
        if (objective.min !== undefined) {
          !!onSendDebugMessage &&
            onSendDebugMessage(
              `Check objective: Parameter ${objective.resourceId} ${res[0].value} >= ${objective.min} -> ${
                res[0].value >= objective.min
              }`
            );
          check = res[0].value >= objective.min;
        }
        if (objective.max !== undefined) {
          !!onSendDebugMessage &&
            onSendDebugMessage(
              `Check objective: Parameter ${objective.resourceId} ${res[0].value} <= ${objective.max} -> ${
                res[0].value <= objective.max
              }`
            );
          check = res[0].value <= objective.max;
        }
      }
    }
    return check;
  }
}

export default Objective;
