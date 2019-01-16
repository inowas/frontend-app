export const CLEAR = 'T07_CLEAR';
export const UPDATE_BASE_MODEL = 'T07_UPDATE_BASE_MODEL';
export const UPDATE_BASE_MODEL_BOUNDARIES = 'T07_UPDATE_BASE_MODEL_BOUNDARIES';

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

        default: {
            return state;
        }
    }
};

export default baseModel;
