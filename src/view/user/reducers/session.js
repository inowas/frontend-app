import {LOGIN, LOGIN_ERROR, LOGOUT, UNAUTHORIZED} from '../actions/actions';

function initialState() {
    return {
        apiKey: localStorage.getItem('apiKey'),
        error: false
    };
}

export const session = (state = initialState(), action) => {
    switch (action.type) {
        case LOGIN: {
            localStorage.setItem('apiKey', action.payload.apiKey);
            return {
                ...state,
                apiKey: action.payload.apiKey,
                error: false
            };
        }

        case LOGIN_ERROR: {
            return {
                ...state,
                error: true
            };
        }

        case UNAUTHORIZED:
        case LOGOUT: {
            localStorage.removeItem('apiKey');
            return initialState();
        }

        default: {
            return state;
        }
    }
};

export const hasSessionKey = state => !!state.apiKey;
export const getApiKey = state => state.apiKey;
