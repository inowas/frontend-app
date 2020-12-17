import {IBoundary} from '../../../core/model/modflow/boundaries/Boundary.type';
import {IModflowModel} from '../../../core/model/modflow/ModflowModel.type';
import {cloneDeep} from 'lodash';

export const CLEAR = 'T07_CLEAR';
export const UPDATE_SCENARIO = 'T07_UPDATE_SCENARIO';
export const UPDATE_SCENARIO_BOUNDARIES = 'T07_UPDATE_SCENARIO_BOUNDARIES';

export type IScenariosReducer = Array<{
    id: string;
    model: IModflowModel;
    boundaries?: IBoundary[];
}>;

const scenarios = (
    state: IScenariosReducer = [],
    action: {id: string; type: string, payload: any}
) => {
    switch (action.type) {
        case CLEAR:
            return [];

        case UPDATE_SCENARIO:
            if (state.filter((sc) => sc.id === action.id).length > 0) {
                return state.map((sc) => {
                    if (sc.model.id === action.id) {
                        return {...sc, model: action.payload};
                    }
                    return sc;
                });
            }

            // eslint-disable-next-line no-case-declarations
            const newState: IScenariosReducer = cloneDeep(state);

            newState.push({
                id: action.id,
                model: action.payload
            });

            return newState;

        case UPDATE_SCENARIO_BOUNDARIES:
            return state.map((sc) => {
                if (sc.model.id === action.id) {
                    return {...sc, boundaries: action.payload};
                }
                return sc;
            });

        default: {
            return state;
        }
    }
};

export default scenarios;
