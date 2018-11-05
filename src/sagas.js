import {call, cancel, fork, take, takeEvery} from 'redux-saga/effects';
import {Saga as Dashboard} from './scenes/dashboard';
import {Saga as User} from './scenes/user';
import {WebData} from 'services';

function* rootSaga() {
    yield [
        takeEvery(
            WebData.Modifier.Query.AT_SEND_HTTP_REQUEST,
            WebData.Saga.sendHttpRequestFlow
        ),
        call(Dashboard.cloneToolInstanceFlow),
        call(Dashboard.createToolInstanceFlow),
        call(Dashboard.loadInstancesFlow),
        call(Dashboard.updateToolInstanceFlow),
        call(Dashboard.deleteToolInstanceFlow),
        call(User.authenticateUser),
        call(User.changePassword),
        call(User.fetchUser),
        call(User.updateUserProfile),
    ];
}

const sagas = [rootSaga];

export const CANCEL_SAGAS_HMR = 'CANCEL_SAGAS_HMR';

const createAbortableSaga = (saga) => {
    if (process.env.NODE_ENV === 'development') {
        return function* main() {
            const sagaTask = yield fork(saga);
            yield take(CANCEL_SAGAS_HMR);
            yield cancel(sagaTask);
        };
    }

    return saga;
};

export const SagaManager = {
    startSagas(sagaMiddleware) {
        sagas.map(createAbortableSaga).forEach(saga => sagaMiddleware.run(saga));
    },

    cancelSagas(store) {
        store.dispatch({
            type: CANCEL_SAGAS_HMR
        });
    }
};
