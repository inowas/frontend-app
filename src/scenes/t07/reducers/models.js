import {cloneDeep} from 'lodash';

export const CLEAR = 'T07_CLEAR';
export const UPDATE_MODEL = 'T07_UPDATE_MODEL';
export const UPDATE_MODEL_BOUNDARIES = 'T07_UPDATE_MODEL_BOUNDARIES';
export const UPDATE_MODEL_SOILMODEL = 'T07_UPDATE_MODEL_SOILMODEL';
export const UPDATE_MODEL_CALCULATION = 'T07_UPDATE_MODEL_CALCULATION';
export const UPDATE_MODEL_RESULTS = 'T07_UPDATE_MODEL_RESULTS';

// state: [{
// id: ...,
// calculationId: ...,
// model: ...,
// boundaries: ...,
// soilmodel: ...,
// calculation: ...,
// results: ...
// }]

const models = (state = [], action) => {
    switch (action.type) {
        case CLEAR:
            return [];

        case UPDATE_MODEL:
            if (state.filter(m => m.id === action.payload.id).length > 0) {
                return state.map(m => {
                    if (m.model.id === action.id) {
                        return {...m, model: action.payload,};
                    }
                    return m;
                });
            }

            state = cloneDeep(state);
            state.push({
                id: action.payload.id,
                calculationId: null,
                model: action.payload
            });

            return state;

        case UPDATE_MODEL_BOUNDARIES:
            return state.map(m => {
                if (m.id === action.id) {
                    return {...m, boundaries: action.payload};
                }
                return m;
            });

        case UPDATE_MODEL_SOILMODEL:
            return state.map(m => {
                if (m.id === action.id) {
                    return {...m, soilmodel: action.payload};
                }
                return m;
            });

        case UPDATE_MODEL_CALCULATION:
            return state.map(m => {
                if (m.id === action.id) {
                    return {...m, calculation: action.payload};
                }
                return m;
            });

        case UPDATE_MODEL_RESULTS:
            return state.map(m => {
                if (m.id === action.id) {
                    return {...m, results: action.payload, calculationId: action.payload.calculation_id};
                }
                return m;
            });

        default: {
            return state;
        }
    }
};

export default models;
