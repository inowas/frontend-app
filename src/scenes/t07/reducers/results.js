export const CLEAR = 'T07_CLEAR';
export const UPDATE_RESULTS = 'T07_UPDATE_RESULTS';

const results = (state = null, action) => {
    switch (action.type) {
        case CLEAR:
            return null;

        case UPDATE_RESULTS:
            return {
                ...state,
                results: {...action.payload}
            };

        default: {
            return state;
        }
    }
};

export default results;
