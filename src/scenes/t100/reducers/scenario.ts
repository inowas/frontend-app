import { CLEAR } from './model';
import { IScenario } from '../../../core/marPro/Scenario.type';
import { LOGOUT, UNAUTHORIZED } from '../../user/actions/actions';

export const UPDATE_SCENARIO = 'MARPRO_UPDATE_SCENARIO';

const initialState = null;

const scenario = (
  state: IScenario | null = initialState,
  action: {
    type: string;
    payload: IScenario;
  }
) => {
  switch (action.type) {
    case CLEAR:
      return initialState;

    case UPDATE_SCENARIO:
      return action.payload;

    case UNAUTHORIZED:
    case LOGOUT: {
      return initialState;
    }

    default:
      return state;
  }
};

export default scenario;
