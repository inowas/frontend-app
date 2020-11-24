import {IHeatTransportInput, IHtm} from '../../../core/model/htm/Htm.type';
import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';

export const CLEAR = 'T19_CLEAR';
export const UPDATE_HTM = 'T19_UPDATE_HTM';
export const UPDATE_HTM_INPUT = 'T19_UPDATE_HTM_INPUT'

const initialState = () => null;

interface IModelAction {
    type: string;
    payload: IHtm | IHeatTransportInput | null;
}

const htm = (state: IHtm | null = initialState(), action: IModelAction): IHtm | null => {
    switch (action.type) {
        case CLEAR:
            return null;

        case UPDATE_HTM:
            return action.payload as IHtm;

        case UPDATE_HTM_INPUT: {
            const p = action.payload as IHeatTransportInput;
            if (!state) {
                return null;
            }
            return {
                ...state,
                data: {
                    ...state.data,
                    input: state.data.input.map((i) => {
                        if (i.type === p.type) {
                            return p;
                        }
                        return i;
                    })
                }
            }
        }

        case UNAUTHORIZED:
        case LOGOUT: {
            return initialState();
        }

        default:
            return state;
    }
};

export default htm;