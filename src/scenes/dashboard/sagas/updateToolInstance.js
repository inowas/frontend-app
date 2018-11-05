import {put, take} from 'redux-saga/effects';
import {Command, Action, Event} from '../actions/index';
import {WebData} from 'services';

export default function* updateToolInstanceFlow() {
    while (true) {
        const action = yield take(action => WebData.Helpers.waitForAction(action, Command.UPDATE_TOOL_INSTANCE));

        yield put(Action.setToolInstance(action.tool, action.payload));
        yield put(WebData.Modifier.Action.sendCommand(action.type, {...action.payload, id: action.id}));

        while (true) {
            const response = yield take(action => WebData.Helpers.waitForResponse(action, Command.UPDATE_TOOL_INSTANCE));

            if (response.webData.type === 'error') {
                break;
            }

            if (response.webData.type === 'success') {
                yield put(Event.toolInstanceUpdated(action.tool, action.id, action.payload));
                break;
            }
        }
    }
}
