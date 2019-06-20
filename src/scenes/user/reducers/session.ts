import {LOGIN, LOGIN_ERROR, LOGOUT, UNAUTHORIZED} from '../actions/actions';

interface ISessionReducer {
    token: string | null;
    error: boolean;
}

interface ISessionReducerAction {
    type: string;
    payload?: any;
}

const initialState = (): ISessionReducer => ({
    token: localStorage.getItem('token'),
    error: false
});

export const session = (state = initialState(), action: ISessionReducerAction) => {
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

export const hasSessionKey = (state: ISessionReducer) => !!state.token;
export const getApiKey = (state: ISessionReducer) => state.token;
