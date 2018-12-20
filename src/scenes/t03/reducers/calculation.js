import {CLEAR} from './model';

const calculation = (state = null, action) => {
    switch (action.type) {
        case CLEAR:
            return null;

        default:
            return state;
    }
};

export default calculation;
