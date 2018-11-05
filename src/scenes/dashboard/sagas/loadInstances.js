import {put, take, call} from 'redux-saga/effects';
import {Query, Action} from '../actions/index';
import {WebData} from 'services';

export default function* loadInstancesFlow() {
    while (true) {
        const {type, tool, publicInstances} = yield take(
            Query.LOAD_INSTANCES
        );

        const responseData = yield call(WebData.Saga.singleAjaxRequest, {
            url: `tools/${tool}` + (publicInstances ? '?public=true' : ''),
            provokingActionType: type
        });

        if (responseData !== null) {
            yield put(Action.setInstances(tool, responseData));
        }
    }
}
