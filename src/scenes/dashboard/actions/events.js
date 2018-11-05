/**
 * Events triggers only a store change from a successful command.
 */

export const TOOL_INSTANCE_CREATED = 'toolInstanceCreated';
export const TOOL_INSTANCE_UPDATED = 'toolInstanceUpdated';
export const TOOL_INSTANCE_CLONED = 'toolInstanceCloned';
export const TOOL_INSTANCE_DELETED = 'toolInstanceDeleted';

export function toolInstanceCreated(tool, id, payload) {
    return {
        type: TOOL_INSTANCE_CREATED,
        tool,
        id,
        payload
    };
}

export function toolInstanceUpdated(tool, id, payload) {
    return {
        type: TOOL_INSTANCE_UPDATED,
        tool,
        id,
        payload
    };
}

export function toolInstanceCloned(tool, id, newId) {
    return {
        type: TOOL_INSTANCE_CLONED,
        tool,
        id,
        payload: newId
    };
}

export function toolInstanceDeleted(tool, id) {
    return {
        type: TOOL_INSTANCE_DELETED,
        tool,
        payload: id
    };
}
