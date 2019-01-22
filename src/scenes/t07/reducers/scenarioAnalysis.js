export const CLEAR = 'T07_CLEAR';
export const UPDATE_SCENARIOANALYSIS = 'T07_UPDATE_SCENARIOANALYSIS';

const scenarioAnalysis = (state = null, action) => {
    switch (action.type) {
        case CLEAR:
            return null;

        case UPDATE_SCENARIOANALYSIS:
            return {
                ...state,
                ...action.payload
            };

        default: {
            return state;
        }
    }
};

export default scenarioAnalysis;
