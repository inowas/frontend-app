import {ICalculation} from '../../../core/model/modflow/Calculation.type';
import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';

export const CLEAR = 'T07_CLEAR';
export const UPDATE_MODEL_CALCULATION = 'T07_UPDATE_CALCULATION';

const initialState: () => any = () => ({});

const calculations = (
    state = initialState(),
    action: { type: string, id: string, payload: ICalculation }
) => {
    switch (action.type) {
        case CLEAR:
            return initialState();

        case UPDATE_MODEL_CALCULATION:
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

export default calculations;
