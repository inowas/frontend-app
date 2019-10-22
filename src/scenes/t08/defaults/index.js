import {
    defaults as T08, SETTINGS_CASE_FIXED_TIME,
    SETTINGS_CASE_VARIABLE_TIME,
    SETTINGS_INFILTRATION_CONTINUOUS,
    SETTINGS_INFILTRATION_ONE_TIME
} from './defaults';

export {
    SETTINGS_CASE_FIXED_TIME,
    SETTINGS_CASE_VARIABLE_TIME,
    SETTINGS_INFILTRATION_CONTINUOUS,
    SETTINGS_INFILTRATION_ONE_TIME
};

export const T08DefaultsWithSession = (session) => {
    let defaultsWithSession = T08;
    if (session && !session.token) {
        defaultsWithSession.permissions = 'r--';
    }

    return defaultsWithSession;
};
