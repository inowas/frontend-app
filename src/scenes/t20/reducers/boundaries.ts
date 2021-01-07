import {CLEAR} from './rtmodelling';
import {IBoundary} from '../../../core/model/modflow/boundaries/Boundary.type';
import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';

export const UPDATE_BOUNDARIES = 'T20_UPDATE_BOUNDARIES';

const initialState = () => ([]);

const boundaries = (state: IBoundary[] = initialState(), action: { type: string, payload?: IBoundary[] }) => {
    switch (action.type) {
        case CLEAR:
            return initialState();

        case UPDATE_BOUNDARIES:
            if (Array.isArray(action.payload)) {
                return action.payload;
            }

            return state;

        case UNAUTHORIZED:
        case LOGOUT: {
            return initialState();
        }

        default:
            return state;
    }
};

export default boundaries;
