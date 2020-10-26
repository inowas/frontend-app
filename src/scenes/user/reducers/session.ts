import getConfig from '../../../config.default';
import {LOGIN, LOGIN_ERROR, LOGOUT, UNAUTHORIZED} from '../actions/actions';

export interface ISessionReducer {
    token: string | null;
    error: boolean;
}

interface ISessionReducerAction {
    type: string;
    payload?: any;
}

const tokenIdentifier = () => `${getConfig().BASE_URL}-token`;

const initialState = (): ISessionReducer => ({
    token: localStorage.getItem(tokenIdentifier()) || null,
    error: false
});

export const session = (state = initialState(), action: ISessionReducerAction) => {
    switch (action.type) {
        case LOGIN: {
            localStorage.setItem(tokenIdentifier(), action.payload.token);
            return {
                ...state,
                token: action.payload.token,
                error: false
            };
        }

        case LOGIN_ERROR: {
            localStorage.removeItem(tokenIdentifier());
            return {
                ...initialState(),
                error: true
            };
        }

        case UNAUTHORIZED:
        case LOGOUT: {
            localStorage.removeItem(tokenIdentifier());
            return initialState();
        }

        default: {
            return state;
        }
    }
};

export const getApiKey = (state: ISessionReducer) => state.token;
export const hasSessionKey = (state: ISessionReducer) => !!state.token;
