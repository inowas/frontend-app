import {put, take, call} from 'redux-saga/effects';
import {Action} from '../actions/index';
import {WebData} from '../../../services';

export default function* authenticateFlow() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const {type, username, password} = yield take(Action.AUTHENTICATION);

        const responseData = yield call(WebData.Saga.singleAjaxRequest, {
            url: '/users/credentials.json',
            provokingActionType: type,
            method: 'post',
            data: {username: username, password: password}
        });

        if (responseData) {
            yield put(Action.login(username, responseData.api_key));
            continue;
        }

        yield put(Action.loginError());
    }
}
