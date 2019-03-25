import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';

export const CLEAR = 'T07_CLEAR';
export const UPDATE_MODEL_BOUNDARIES = 'T07_UPDATE_MODEL_BOUNDARIES';

// state: {
// id: boundaries
// }

const initialState = {};

const boundaries = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR:
            return initialState;

        case UPDATE_MODEL_BOUNDARIES:
            const id = action.id;
            const boundaries = action.payload;

            return {...state, [id]: boundaries};


        case UNAUTHORIZED:
        case LOGOUT: {
            return initialState;
        }

        default: {
            return state;
        }
    }
};

export default boundaries;
