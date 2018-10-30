/**
 * Events triggers only a store change from a successful command.
 */

export const SET_USER_PROFILE = 'users/SET_USER_PROFILE';

export function setUserProfile(profile) {
    return {
        type: SET_USER_PROFILE,
        payload: profile
    };
}
