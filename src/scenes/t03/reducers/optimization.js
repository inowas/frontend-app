export const UPDATE_OPTIMIZATION = 'T03_UPDATE_OPTIMIZATION';

const optimization = (state = null, action) => {
    switch (action.type) {
        case UPDATE_OPTIMIZATION:
            return {
                ...state, ...action.payload
            };

        default:
            return state;
    }
};

export default optimization;
