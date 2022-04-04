import { CLEAR } from './model';
import { ITransport } from '../../../core/model/modflow/transport/Transport.type';
import { LOGOUT, UNAUTHORIZED } from '../../user/actions/actions';

export const UPDATE_TRANSPORT = 'MARPRO_UPDATE_TRANSPORT';

const initialState = null;

const transport = (
  state: ITransport | null = initialState,
  action: {
    type: string;
    payload: ITransport;
  }
) => {
  switch (action.type) {
    case CLEAR:
      return initialState;

    case UPDATE_TRANSPORT:
      return action.payload;

    case UNAUTHORIZED:
    case LOGOUT: {
      return initialState;
    }

    default:
      return state;
  }
};

export default transport;
