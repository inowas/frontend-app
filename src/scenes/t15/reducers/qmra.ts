import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';
import IQmra from '../../../core/model/qmra/Qmra.type';

export const CLEAR = 'T15_CLEAR';
export const UPDATE_QMRA= 'T15_UPDATE_QMRA';

const initialState = () => null;

interface IModelAction {
  type: string;
  payload: IQmra | null;
}

const qmra = (state: IQmra | null = initialState(), action: IModelAction): IQmra | null => {
  switch (action.type) {
    case CLEAR:
      return null;

    case UPDATE_QMRA:
      return action.payload as IQmra;

    case UNAUTHORIZED:
    case LOGOUT: {
      return initialState();
    }

    default:
      return state;
  }
};

export default qmra;
