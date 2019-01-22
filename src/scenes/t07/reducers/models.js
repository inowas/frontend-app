export const CLEAR = 'T07_CLEAR';
export const UPDATE_MODEL = 'T07_UPDATE_MODEL';

// state: {
// id: model,
// ...: ...
// }

const initialState = {};

const models = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR:
            return initialState;

        case UPDATE_MODEL:
            const id = action.payload.id;
            const model = action.payload;

            return {...state, [id]: model};

        default: {
            return state;
        }
    }
};

export default models;
