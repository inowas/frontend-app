export const CLEAR = 'T07_CLEAR';
export const UPDATE_BASE_MODEL = 'T07_UPDATE_BASE_MODEL';
export const UPDATE_BASE_MODEL_BOUNDARIES = 'T07_UPDATE_BASE_MODEL_BOUNDARIES';
export const UPDATE_BASE_MODEL_SOILMODEL = 'T07_UPDATE_BASE_MODEL_SOILMODEL';
export const UPDATE_BASE_MODEL_CALCULATION = 'T07_UPDATE_BASE_MODEL_CALCULATION';
export const UPDATE_BASE_MODEL_RESULTS = 'T07_UPDATE_BASE_MODEL_RESULTS';

const initialState = {
    model: null,
    boundaries: null
};

const baseModel = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR:
            return initialState;

        case UPDATE_BASE_MODEL:
            return {
                ...state, model: action.payload
            };

        case UPDATE_BASE_MODEL_BOUNDARIES:
            return {
                ...state, boundaries: action.payload
            };

        case UPDATE_BASE_MODEL_SOILMODEL:
            return {
                ...state, soilmodel: action.payload
            };

        case UPDATE_BASE_MODEL_CALCULATION:
            return {
                ...state, calculation: action.payload
            };

        case UPDATE_BASE_MODEL_RESULTS:
            return {
                ...state, results: action.payload
            };

        default: {
            return state;
        }
    }
};

export default baseModel;
