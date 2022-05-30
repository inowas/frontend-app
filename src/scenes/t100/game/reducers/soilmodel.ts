import { CLEAR } from './model';
import { ISoilmodel } from '../../../../core/model/modflow/soilmodel/Soilmodel.type';
import { LOGOUT, UNAUTHORIZED } from '../../../user/actions/actions';

export const UPDATE_SOILMODEL = 'MARPRO_UPDATE_SOILMODEL';

const initialState = null;

const soilmodel = (
  state: ISoilmodel | null = initialState,
  action: {
    type: string;
    payload: ISoilmodel;
  }
) => {
  switch (action.type) {
    case CLEAR:
      return initialState;

    case UPDATE_SOILMODEL:
      return action.payload;

    case UNAUTHORIZED:
    case LOGOUT: {
      return initialState;
    }

    default:
      return state;
  }
};

export default soilmodel;
