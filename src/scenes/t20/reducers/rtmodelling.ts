import {IRtModelling} from '../../../core/model/rtm/modelling/RTModelling.type';
import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';

export const CLEAR = 'T20_CLEAR';
export const UPDATE_RTMODELLING = 'T20_UPDATE_RTMODELLING';

const initialState = () => null;

interface IModelAction {
    type: string;
    payload: IRtModelling;
}

const rtmodelling = (state: IRtModelling | null = initialState(), action: IModelAction) => {
    switch (action.type) {
        case CLEAR:
            return null;

        case UPDATE_RTMODELLING:
            return action.payload;

        case UNAUTHORIZED:
        case LOGOUT: {
            return initialState();
        }

        default:
            return state;
    }
};

export default rtmodelling;