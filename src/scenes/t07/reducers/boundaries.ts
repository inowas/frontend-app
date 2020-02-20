import {IBoundary} from '../../../core/model/modflow/boundaries/Boundary.type';
import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';

export const CLEAR = 'T07_CLEAR';
export const UPDATE_MODEL_BOUNDARIES = 'T07_UPDATE_MODEL_BOUNDARIES';

// state: {
// id: boundaries
// }

const initialState: () => any = () => ({});

const boundaries = (
    state = initialState(),
    action: { type: string, id: string, payload: IBoundary[] }
) => {
    switch (action.type) {
        case CLEAR:
            return initialState();

        case UPDATE_MODEL_BOUNDARIES:
            return {...state, [action.id]: action.payload};

        case UNAUTHORIZED:
        case LOGOUT: {
            return initialState();
        }

        default: {
            return state;
        }
    }
};

export default boundaries;
