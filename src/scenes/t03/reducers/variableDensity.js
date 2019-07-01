import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';
import {CLEAR} from './model';

export const UPDATE_VARIABLE_DENSITY = 'T03_UPDATE_VARIABLE_DENSITY';

const initialState = [];

const variableDensity = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR:
            return initialState;

        case UPDATE_VARIABLE_DENSITY:
            return action.payload;

        case UNAUTHORIZED:
        case LOGOUT: {
            return initialState;
        }

        default:
            return state;
    }
};

export default variableDensity;
