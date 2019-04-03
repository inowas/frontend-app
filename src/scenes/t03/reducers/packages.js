import {CLEAR} from './model';
import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';

export const UPDATE_PACKAGES = 'T03_UPDATE_PACKAGES';
export const UPDATE_PACKAGES_SET_DIRTY_FLAG = 'T03_UPDATE_PACKAGES_SET_DIRTY_FLAG';

const initialState = null;

const packages = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR:
            return initialState;

        case UPDATE_PACKAGES:
            return action.payload;

        case UPDATE_PACKAGES_SET_DIRTY_FLAG:
            return action.payload;

        case UNAUTHORIZED:
        case LOGOUT: {
            return initialState;
        }

        default:
            return state;
    }
};

export default packages;
