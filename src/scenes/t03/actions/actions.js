import {UPDATE_GENERAL} from "../reducers/general";

export function updateGeneral(general) {
    return {
        type: UPDATE_GENERAL,
        payload: general
    };
}
