import {put, take, call} from 'redux-saga/effects';
import {Action} from '../actions/index';
import {WebData} from '../../../services';

export default function* fetchUserFlow() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const {type} = yield take(Action.FETCH_USER);

        const responseData = yield call(WebData.Saga.singleAjaxRequest, {
            url: '/users.json',
            provokingActionType: type
        });

        if (responseData) {
            yield put(Action.setUser(responseData));
        }
    }
}
