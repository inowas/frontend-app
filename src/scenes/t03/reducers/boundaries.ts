import {IBoundary} from '../../../core/model/modflow/boundaries/Boundary.type';
import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';
import {CLEAR} from './model';

export const UPDATE_BOUNDARIES = 'T03_UPDATE_BOUNDARIES';

export type IBoundariesReducer = IBoundary[] | undefined;

const initialState: IBoundariesReducer = [];

const boundaries = (state = initialState, action: { type: string, boundaries?: IBoundary[] }) => {
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
