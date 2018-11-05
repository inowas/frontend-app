import {has} from 'lodash';
import {Action} from './actions';

export const fetchStatusWrapper = (request, apiKey) => {
    request.options.headers['X-AUTH-TOKEN'] = apiKey;

    return fetch(request.url, request.options).then(response => {
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.indexOf('application/json') !== -1) {
            return response
                .json()
                .then(function(json) {
                    return response.ok ? json : Promise.reject(json);
                })
                .catch(function(error) {
                    // if ok then empty response was given e.g. 200
                    return response.ok ? {} : Promise.reject(error);
                });
        }
        return response.ok ? {} : Promise.reject({});
    });
};

export const waitForResponse = (action, responseAction) =>
    action.type === Action.SET_AJAX_STATUS &&
    action.provokingActionType === responseAction;
export const isSuccess = action =>
    has(action, 'webData.type') && action.webData.type === 'success';
export const isError = action =>
    has(action, 'webData.type') && action.webData.type === 'error';
export const waitForAction = (action, responseAction) =>
    action.type === responseAction && !action.webData;
