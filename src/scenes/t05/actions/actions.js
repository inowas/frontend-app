import {CLEAR_TOOL, UPDATE_TOOL} from '../reducers/mcda';

export function clearTool() {
    return {
        type: CLEAR_TOOL
    }
}

export function updateTool(payload) {
    return {
        type: UPDATE_TOOL,
        payload: payload
    };
}