import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';

export const UPDATE_OPTIMIZATION = 'T03_UPDATE_OPTIMIZATION';

const initialState = null;

const optimization = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_OPTIMIZATION:
            return {
                ...state, ...action.payload
            };


        case UNAUTHORIZED:
        case LOGOUT: {
            return initialState;
        }

        default:
            return state;
    }
};

export default optimization;
