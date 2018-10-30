import {take, call} from 'redux-saga/effects';
import {Action} from '../actions/index';
import {WebData} from '../../../services';

export default function* changePassword() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const {type, payload} = yield take(Action.CHANGE_PASSWORD);

        yield call(WebData.Saga.singleAjaxRequest, {
            url: '/users/changePassword',
            provokingActionType: type,
            method: 'post',
            data: payload
        });
    }
}
