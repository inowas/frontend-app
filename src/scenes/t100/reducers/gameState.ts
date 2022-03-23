import { CLEAR } from './model';
import { IGameState } from '../../../core/marPro/GameState.type';
import { LOGOUT, UNAUTHORIZED } from '../../user/actions/actions';

export const UPDATE_GAMESTATE = 'MARPRO_UPDATE_GAMESTATE';

const initialState = null;

const gameState = (
  state: IGameState | null = initialState,
  action: {
    type: string;
    payload: IGameState;
  }
) => {
  switch (action.type) {
    case CLEAR:
      return initialState;

    case UPDATE_GAMESTATE:
      return action.payload;

    case UNAUTHORIZED:
    case LOGOUT: {
      return initialState;
    }

    default:
      return state;
  }
};

export default gameState;
