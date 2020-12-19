import {CLEAR} from './rtmodelling';
import {IVariableDensity} from '../../../core/model/modflow/variableDensity/VariableDensity.type';
import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';

export const UPDATE_VARIABLE_DENSITY = 'T20_UPDATE_VARIABLE_DENSITY';

const initialState: () => IVariableDensity = () => {
    return {
        vdfEnabled: false,
        vscEnabled: false
    };
};

const variableDensity = (state: IVariableDensity = initialState(), action: {
    type: string,
    payload: IVariableDensity
}) => {
    switch (action.type) {
        case CLEAR:
            return initialState();

        case UPDATE_VARIABLE_DENSITY:
            return action.payload;

        case UNAUTHORIZED:
        case LOGOUT: {
            return initialState();
        }

        default:
            return state;
    }
};

export default variableDensity;
