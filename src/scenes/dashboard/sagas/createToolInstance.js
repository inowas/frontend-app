import {put, take} from 'redux-saga/effects';
import {Action, Command, Event} from '../actions/index';
import {WebData} from 'services';

export default function* createToolInstanceFlow() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        // eslint-disable-next-line no-shadow
        const action = yield take(action => WebData.Helpers.waitForAction(action, Command.CREATE_TOOL_INSTANCE));

        yield put(Action.setToolInstance(action.tool, action.payload));
        yield put(WebData.Modifier.Action.sendCommand(action.type, {...action.payload, id: action.id}));

        // eslint-disable-next-line no-constant-condition
        while (true) {
            // eslint-disable-next-line no-shadow
            const response = yield take(action => WebData.Helpers.waitForResponse(action, Command.CREATE_TOOL_INSTANCE));

            if (response.webData.type === 'error') {
                break;
            }

            if (response.webData.type === 'success') {
                yield put(Event.toolInstanceCreated(action.tool, action.id, action.payload));
                // ToDo redirect to the new tool
                // yield put(
                //    push(
                //        Routing.editToolInstanceUrl(action.routes, action.params)(action.id)
                //    )
                //);
                break;
            }
        }
    }
}
