import {CLEAR} from './model';
import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';

export const UPDATE_BOUNDARIES = 'T03_UPDATE_BOUNDARIES';
export const REMOVE_BOUNDARY = 'T03_REMOVE_BOUNDARY';

const initialState = [];

const boundaries = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR:
            return initialState;

        case UPDATE_BOUNDARIES:
            return action.boundaries;

        case REMOVE_BOUNDARY:
            console.log({
                state,
                payload: action.payload
            });
            return state.filter(b => b.id !== action.payload);

        case UNAUTHORIZED:
        case LOGOUT: {
            return initialState;
        }

        default:
            return state;
    }
};

export default boundaries;
