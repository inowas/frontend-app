import {CLEAR} from './model';
import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';

export const UPDATE_TRANSPORT = 'T03_UPDATE_TRANSPORT';

const initialState = [];

const transport = (state = initialState, action) => {
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
