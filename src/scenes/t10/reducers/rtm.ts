import { IRtm } from '../../../core/model/rtm/monitoring/Rtm.type';
import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';

export const CLEAR = 'T10_CLEAR';
export const UPDATE_RTM = 'T10_UPDATE_RTM';

const initialState = () => null;

interface IModelAction {
  type: string;
  payload: IRtm | null;
}

const rtm = (state: IRtm | null = initialState(), action: IModelAction): IRtm | null => {
  switch (action.type) {
    case CLEAR:
      return null;

    case UPDATE_RTM:
      return action.payload as IRtm;

    case UNAUTHORIZED:
    case LOGOUT: {
      return initialState();
    }

    default:
      return state;
  }
};

export default rtm;
