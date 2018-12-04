export const UPDATE_BOUNDARIES = 'T03_UPDATE_BOUNDARIES';

const initialState = [];

const boundaries = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_BOUNDARIES:
            return action.boundaries;

        default:
            return state;
    }
};

export default boundaries;
