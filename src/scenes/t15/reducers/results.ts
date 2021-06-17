import {CLEAR} from './qmra';
import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';
import IResults from '../../../core/model/qmra/result/Results.type';

export const UPDATE_QMRA_RESULTS = 'T15_UPDATE_QMRA_RESULTS';

const initialState = () => null;

interface IModelAction {
  type: string;
  payload: IResults | null;
}

const results = (state: IResults | null = initialState(), action: IModelAction): IResults | null => {
  switch (action.type) {
    case CLEAR:
      return null;

    case UPDATE_QMRA_RESULTS:
      return action.payload as IResults;

    case UNAUTHORIZED:
    case LOGOUT: {
      return initialState();
    }

    default:
      return state;
  }
};

export default results;
