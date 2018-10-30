import config from '../../../config';
import {WebData} from '../../';

export const AT_RESET_WEB_DATA = 'AT_RESET_WEB_DATA';
export const AT_CLEAR_WEB_DATA = 'AT_CLEAR_WEB_DATA';

export function reset(provokingActionType) {
    return {
        type: AT_RESET_WEB_DATA,
        provokingActionType
    };
}

export function clear() {
    return {
        type: AT_CLEAR_WEB_DATA
    };
}

export const SET_AJAX_STATUS = 'SET_AJAX_STATUS';

export function setAjaxStatus(provokingActionType, status, tool) {
    return {
        type: SET_AJAX_STATUS,
        provokingActionType,
        status,
        tool,
        webData: status // legacy
    };
}

export function stateToCreatePayload(state) {
    return {
        name: state.name,
        description: state.description,
        geometry: state.geometry,
        bounding_box: state.bounding_box,
        grid_size: state.grid_size,
        time_unit: state.time_unit,
        length_unit: state.length_unit,
        public: state.public,
    };
}

export function payloadToSetModel(payload) {
    return payload;
}

export function buildRequest(url, method, body) {
    const options = {
        headers: {
            'Accept': 'application/json',
            'Access-Control-Request-Method': method
        },
        method
    };
    if (body) {
        options.body = body;
        options.headers['Content-Type'] = 'application/json';
    }

    return {url: config.baseURL + '/v2/' + url, options};
}


export function sendMessageBox(responseAction, body, tool) {
    return WebData.Modifier.Query.sendHttpRequest(buildRequest('messagebox', 'POST', JSON.stringify(body)), responseAction, tool);
}

export function sendCommand(messageName, payload, metadata = [], tool) {
    return sendMessageBox(
        messageName, {
            metadata,
            message_name: messageName,
            payload,
        },
        tool
    );
}

export function sendQuery(url, responseAction, tool) {
    return WebData.Modifier.Query.sendHttpRequest(buildRequest(url, 'GET'), responseAction, tool);
}


// legacy
export function responseAction(provokingActionType, status, tool) {
    return setAjaxStatus(provokingActionType, status, tool);
}
