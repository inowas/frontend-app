import { CLEAR } from './model';
import { IToolInstance } from '../../../types';
import { LOGOUT, UNAUTHORIZED } from '../../../user/actions/actions';

export const UPDATE_T03_INSTANCES = 'MARPRO_UPDATE_T03_INSTANCES';

const initialState = () => [];

interface IModelAction {
  type: string;
  payload: IToolInstance[];
}

const t03instances = (state: IToolInstance[] = initialState(), action: IModelAction): IToolInstance[] => {
  switch (action.type) {
    case CLEAR:
      return [];

    case UPDATE_T03_INSTANCES:
      return action.payload;

    case UNAUTHORIZED:
    case LOGOUT: {
      return initialState();
    }

    default:
      return state;
  }
};

export default t03instances;
