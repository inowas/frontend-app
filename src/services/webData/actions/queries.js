export const AT_SEND_HTTP_REQUEST = 'AT_SEND_HTTP_REQUEST';

export function sendHttpRequest(request, responseAction, tool) {
    return {
        type: AT_SEND_HTTP_REQUEST,
        tool,
        request,
        responseAction
    };
}
