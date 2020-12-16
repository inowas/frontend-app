import {LOGOUT, SET_USER, UNAUTHORIZED} from '../actions/actions';
import {SET_USER_PROFILE} from '../actions/events';

const initialState = () => ({
    id: '',
    userName: '',
    name: '',
    email: '',
    enabled: true,
    roles: [],
    profile: {
        name: '',
        email: '',
        institution: ''
    },
    settings: {
        dateFormat: 'YYYY/MM/DD'
    },
    fetched: false
});

export interface IUserReducer {
    id: string;
    userName: string;
    name: string;
    email: string;
    profile: {
        institution: string;
        name: string;
        email: string
    };
    settings: {
        dateFormat: string
    }
    roles: any[];
    enabled: boolean;
    fetched: boolean;
}

export const user = (state: IUserReducer = initialState(), action: any) => {
    switch (action.type) {
        case SET_USER: {
            return {
                ...state,
                id: action.payload.id || state.id,
                userName: action.payload.username || state.userName,
                name: action.payload.name || state.name,
                email: action.payload.email || state.email,
                roles: action.payload.roles || state.roles,
                profile: action.payload.profile || state.profile,
                settings: action.payload.settings || state.settings,
                enabled: action.payload.enabled || state.enabled,
                fetched: true
            };
        }

        case SET_USER_PROFILE: {
            return {
                ...state,
                profile: action.payload
            };
        }

        case UNAUTHORIZED:
        case LOGOUT: {
            return initialState();
        }

        default: {
            return state;
        }
    }
};

export const getEmail = (state: IUserReducer) => state.email;
export const getName = (state: IUserReducer) => state.name;
export const getRoles = (state: IUserReducer) => state.roles;
export const getUserName = (state: IUserReducer) => state.userName;
export const getFetched = (state: IUserReducer) => state.fetched;
export const isAdmin = (state: IUserReducer) => {
    return state.roles && Array.isArray(state.roles) && state.roles.includes('ROLE_ADMIN');
};
