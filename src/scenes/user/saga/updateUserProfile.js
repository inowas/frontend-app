import {put, take, call} from 'redux-saga/effects';
import {Action, Event} from '../actions/index';
import {WebData} from '../../../services';

export default function* updateUserProfile() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const {type, payload} = yield take(Action.PUT_USER_PROFILE);

        const responseData = yield call(WebData.Saga.singleAjaxRequest, {
            url: '/users.json',
            provokingActionType: type,
            method: 'put',
            data: payload
        });

        if (responseData) {
            yield put(Event.setUserProfile(payload));
        }
    }
}
