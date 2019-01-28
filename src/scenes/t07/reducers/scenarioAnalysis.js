import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';

export const CLEAR = 'T07_CLEAR';
export const UPDATE_SCENARIOANALYSIS = 'T07_UPDATE_SCENARIOANALYSIS';

const initialState = null;

const scenarioAnalysis = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR:
            return null;

        case UPDATE_SCENARIOANALYSIS:
            return {
                ...state,
                ...action.payload
            };


        case UNAUTHORIZED:
        case LOGOUT: {
            return initialState;
        }

        default: {
            return state;
        }
    }
};

export default scenarioAnalysis;
