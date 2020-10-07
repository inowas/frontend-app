import {ISoilmodel} from '../../../core/model/modflow/soilmodel/Soilmodel.type';
import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';

export const CLEAR = 'T07_CLEAR';
export const UPDATE_MODEL_SOILMODEL = 'T07_UPDATE_SOILMODEL';

const initialState: () => any = () => ({});

const soilmodels = (
    state = initialState(),
    action: { type: string, id: string, payload: ISoilmodel }
) => {
    switch (action.type) {
        case CLEAR:
            return initialState();

        case UPDATE_MODEL_SOILMODEL:
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

export default soilmodels;
