import {applyMiddleware, compose, createStore} from 'redux';
import rootReducer from './reducers';
import {composeWithDevTools} from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import {createBrowserHistory} from 'history'
import {routerMiddleware, connectRouter} from 'connected-react-router'
import {SagaManager} from './sagas';

const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();

// middleware always needed
const middlewares = [
    routerMiddleware(history),
    sagaMiddleware,
    thunk,
    unauthorizedMiddleware()
];

let appliedCompose = compose;
if (process.env.NODE_ENV === 'development') {
    appliedCompose = composeWithDevTools;
    const {logger} = require('redux-logger');
    middlewares.push(logger);
}

export default function configureStore(initialState = {}) {
    const store = createStore(
        connectRouter(history)(rootReducer),
        initialState,
        appliedCompose(
            applyMiddleware(...middlewares)
        )
    );

    SagaManager.startSagas(sagaMiddleware);

    return store;
}

function unauthorizedMiddleware() {
    return ref => {
        const {dispatch} = ref;

        return next => action => {
            if (action.payload && action.payload instanceof Error && action.payload.response && action.payload.response.status === 401) {
                dispatch({
                    type: 'UNAUTHORIZED'
                });
            }

            next(action);
        };
    };
}
