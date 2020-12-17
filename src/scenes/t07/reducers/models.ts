import {IModflowModel} from '../../../core/model/modflow/ModflowModel.type';
import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';

export const CLEAR = 'T07_CLEAR';
export const UPDATE_MODEL = 'T07_UPDATE_MODEL';

export interface IModelsReducer {
    [id: string]: IModflowModel;
}

const initialState: () => any = () => ({});

const models = (
    state: IModelsReducer = initialState(),
    action: { type: string, payload: IModflowModel }
) => {
    switch (action.type) {
        case CLEAR:
            return initialState();

        case UPDATE_MODEL:
            return {...state, [action.payload.id]: action.payload};

        case UNAUTHORIZED:
        case LOGOUT: {
            return initialState();
        }

        default: {
            return state;
        }
    }
};

export default models;
