import { GenericObject } from '../model/genericObject/GenericObject';
import { IGameState } from './GameState.type';
import { IScenario } from './Scenario.type';
import { cloneDeep } from 'lodash';

class GameState extends GenericObject<IGameState> {
  public static fromObject(value: IGameState) {
    return new GameState(value);
  }

  public static fromScenario(scenario: IScenario) {
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
}

export default GameState;