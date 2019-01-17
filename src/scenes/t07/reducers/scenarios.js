import {cloneDeep} from 'lodash';

export const CLEAR = 'T07_CLEAR';
export const UPDATE_SCENARIO = 'T07_UPDATE_SCENARIO';
export const UPDATE_SCENARIO_BOUNDARIES = 'T07_UPDATE_SCENARIO_BOUNDARIES';

// state: [{id: ..., model: ..., boundaries: ...}]

const scenarios = (state = [], action) => {
    switch (action.type) {
        case CLEAR:
            return [];

        case UPDATE_SCENARIO:
            if (state.filter(sc => sc.id === action.id).length > 0) {
                return state.map(sc => {
                    if (sc.model.id === action.id) {
                        return {...sc, model: action.payload};
                    }
                    return sc;
                });
            }

            const newState = cloneDeep(state);

            newState.push({
                id: action.id,
                model: action.payload
            });

            return newState;

        case UPDATE_SCENARIO_BOUNDARIES:
            return state.map(sc => {
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
