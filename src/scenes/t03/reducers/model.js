export const UPDATE_MODEL = 'T03_UPDATE_MODEL';

const model = (state = null, action) => {
    switch (action.type) {
        case UPDATE_MODEL:
            return {
                ...state, ...action.model
            };

        default:
            return state;
    }
};

export default model;
