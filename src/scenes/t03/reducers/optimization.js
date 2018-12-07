import Optimization from 'core/model/modflow/optimization/Optimization';

export const UPDATE_OPTIMIZATION = 'T03_UPDATE_OPTIMIZATION';

const optimization = (state = Optimization.fromDefaults(), action) => {
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
