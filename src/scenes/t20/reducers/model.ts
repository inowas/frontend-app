import {CLEAR} from './rtmodelling';
import {IModflowModel} from '../../../core/model/modflow/ModflowModel.type';
import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';
import _ from 'lodash';

export const UPDATE_MODEL = 'T20_UPDATE_MODEL';

const initialState = () => null;

interface IModelAction {
    type: string;
    payload: IModflowModel;
}

const model = (state: IModflowModel | null = initialState(), action: IModelAction) => {
    switch (action.type) {
        case CLEAR:
            return null;

        case UPDATE_MODEL:
            return _.cloneDeep(action.payload);

        case UNAUTHORIZED:
        case LOGOUT: {
            return initialState();
        }

        default:
            return state;
    }
};

export default model;
