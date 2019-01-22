import {CLEAR} from './model';

export const UPDATE_CALCULATION = 'T03_UPDATE_CALCULATION';

const initialState = null;

const calculation = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR:
            return initialState;

        case UPDATE_CALCULATION:
            return action.payload;

        default:
            return state;
    }
};

export default calculation;
