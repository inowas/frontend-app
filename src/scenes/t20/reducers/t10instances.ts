import {CLEAR} from './rtmodelling';
import {IToolInstance} from '../../dashboard/defaults/tools';
import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';

export const UPDATE_T10_INSTANCES = 'T20_UPDATE_T10_INSTANCES';

const initialState = () => [];

interface IModelAction {
    type: string;
    payload: IToolInstance[];
}

const t10instances = (state: IToolInstance[] = initialState(), action: IModelAction): IToolInstance[] => {
    switch (action.type) {
        case CLEAR:
            return [];

        case UPDATE_T10_INSTANCES:
            return action.payload;

        case UNAUTHORIZED:
        case LOGOUT: {
            return initialState();
        }

        default:
            return state;
    }
};

export default t10instances; 