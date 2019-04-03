import {LOGIN, LOGIN_ERROR, LOGOUT, UNAUTHORIZED} from '../actions/actions';

const initialState = () => ({
    token: localStorage.getItem('token'),
    error: false
});

export const session = (state = initialState(), action) => {
    switch (action.type) {
        case LOGIN: {
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                token: action.payload.token,
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
            localStorage.removeItem('token');
            return initialState();
        }

        default: {
            return state;
        }
    }
};

export const hasSessionKey = state => !!state.token;
export const getApiKey = state => state.token;
