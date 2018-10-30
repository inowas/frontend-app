import {call, put, select} from 'redux-saga/effects';
import {Action} from '../actions';
import {fetchStatusWrapper} from '../helpers';
import {Action as UserActions} from '../../../user/actions';
import {getApiKey} from '../../../user/reducers';

export default function* sendHttpRequestFlow(action) {
    yield put(Action.responseAction(action.responseAction, {type: 'loading'}, action.tool));

    try {
        const state = yield select();
        const apiKey = getApiKey(state.session);
        const data = yield call(fetchStatusWrapper, action.request, apiKey);

        yield put(Action.responseAction(action.responseAction, {type: 'success', data: data}, action.tool));
    } catch (err) {
        let msg = 'Unknown Error';

        if (typeof err === 'string') {
            msg = err;
        } else {
            const error = err.error || {message: undefined};
            msg = error.message || msg;
        }

        yield put(Action.responseAction(action.responseAction, {type: 'error', msg: msg}, action.tool));

        if (err.response.status === 401) {
            yield put(UserActions.logout());
        }
    }
}
