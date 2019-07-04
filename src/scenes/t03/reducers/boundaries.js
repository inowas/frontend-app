import {CLEAR} from './model';
import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';

export const UPDATE_BOUNDARIES = 'T03_UPDATE_BOUNDARIES';

const initialState = [];

const boundaries = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR:
            return initialState;

        case UPDATE_BOUNDARIES:
            return action.boundaries;

        case UNAUTHORIZED:
        case LOGOUT: {
            return initialState;
        }

        default:
            return state;
    }
};

export default boundaries;
