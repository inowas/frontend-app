import { CLEAR } from './model';
import { IBoundary } from '../../../core/model/modflow/boundaries/Boundary.type';
import { LOGOUT, UNAUTHORIZED } from '../../user/actions/actions';

export const UPDATE_BOUNDARIES = 'MARPRO_UPDATE_BOUNDARIES';

const initialState = () => [];

const boundaries = (state: IBoundary[] = [], action: { type: string; boundaries?: IBoundary[] }) => {
  switch (action.type) {
    case CLEAR:
      return initialState();

    case UPDATE_BOUNDARIES:
      if (Array.isArray(action.boundaries)) {
        return action.boundaries;
      }

      return state;

    case UNAUTHORIZED:
    case LOGOUT: {
      return initialState();
    }

    default:
      return state;
  }
};

export default boundaries;
