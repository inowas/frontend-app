export const UPDATE_MCDA = 'T05_UPDATE_MCDA';

const initialState = null;

const model = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_MCDA:
            return {
                ...state, ...action.mcda
            };

        default:
            return state;
    }
};

export default model;
