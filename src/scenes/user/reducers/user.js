import {LOGOUT, SET_USER, UNAUTHORIZED} from '../actions/actions';
import {SET_USER_PROFILE} from '../actions/events';

function initialState() {
    return {
        userName: '',
        name: '',
        email: '',
        enabled: true,
        roles: [],
        profile: {
            'name': '',
            'email': '',
            'institution': ''
        },
        fetched: false
    };
}

export const user = (state = initialState(), action) => {
    switch (action.type) {
        case SET_USER: {
            return {
                ...state,
                userName: action.payload.user_name || state.userName,
                name: action.payload.name || state.name,
                email: action.payload.email || state.email,
                roles: action.payload.roles || state.roles,
                profile: action.payload.profile || state.profile,
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

export const getEmail = state => state.email;
export const getName = state => state.name;
export const getRoles = state => state.roles;
export const getUserName = state => state.userName;
export const getFetched = state => state.fetched;
export const isAdmin = state => state.roles && Array.isArray(state.roles) && state.roles.includes('ROLE_ADMIN');
