import {CLEAR} from './htm';
import {IDateTimeValue} from '../../../core/model/rtm/Sensor.type';
import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';
import _ from 'lodash';

export const UPDATE_DATA = 'T19_UPDATE_DATA';

const initialState = {
    gw: null,
    sw: null
};

interface IModelAction {
    type: string;
    payload: {
        type: 'gw' | 'sw';
        data: IDateTimeValue[] | null;
    }
}

export interface IDataState {
    gw: IDateTimeValue[] | null;
    sw: IDateTimeValue[] | null;
}

const data = (state: IDataState = initialState, action: IModelAction): IDataState => {
    switch (action.type) {
        case CLEAR:
            return initialState;

        case UPDATE_DATA: {
            const cState = _.cloneDeep(state);
            cState[action.payload.type] = action.payload.data;
            return cState;
        }

        case UNAUTHORIZED:
        case LOGOUT: {
            return initialState;
        }

        default:
            return state;
    }
};

export default data;