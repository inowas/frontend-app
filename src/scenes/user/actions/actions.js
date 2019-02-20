/**
 * Actions triggers only a store change.
 */
export const LOGIN = 'session/LOGIN';
export const LOGIN_ERROR = 'session/LOGIN_ERROR';
export const LOGOUT = 'session/LOGOUT';

export const AUTHENTICATION = 'users/AUTHENTICATION';
export const CHANGE_PASSWORD = 'users/CHANGE_PASSWORD';
export const FETCH_USER = 'users/FETCH_USER';
export const PUT_USER_PROFILE = 'users/PUT_USER_PROFILE';

export const SET_USER = 'users/SET_USER';
export const UNAUTHORIZED = 'users/UNAUTHORIZED_ACCESS';

export function authentication(username, password) {
    return {
        type: AUTHENTICATION,
        username,
        password
    };
}

export function changePassword({oldPassword, newPassword}) {
    return {
        type: CHANGE_PASSWORD,
        payload: {
            oldPassword,
            newPassword
        }
    };
}

export function fetchUser() {
    return {
        type: FETCH_USER
    };
}

export function login(username, token) {
    return {
        type: LOGIN,
        payload: {
            username,
            token
        }
    };
}

export function logout() {
    return {
        type: LOGOUT
    };
}

export function loginError() {
    return {
        type: LOGIN_ERROR
    };
}

export function putUserProfile(userProfile) {
    return {
        type: PUT_USER_PROFILE,
        payload: userProfile
    };
}

export function setUser(userInformation) {
    return {
        type: SET_USER,
        payload: userInformation
    };
}
