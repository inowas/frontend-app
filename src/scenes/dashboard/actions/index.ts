import {ITool} from '../defaults/tools';

export const SET_ACTIVE_TOOL = 'DASHBOARD_SET_ACTIVE_TOOL';
export const SET_PUBLIC = 'DASHBOARD_SET_PUBLIC';

export function setActiveTool(tool: ITool) {
    return {
        type: SET_ACTIVE_TOOL,
        payload: tool
    };
}

export function setPublic(publicInstances: boolean) {
    return {
        type: SET_PUBLIC,
        payload: publicInstances
    };
}
