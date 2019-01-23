import {applyMiddleware, compose, createStore} from 'redux';
import rootReducer from './reducers';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';

// middleware always needed
const middlewares = [
    thunk,
    unauthorizedMiddleware()
];

let appliedCompose = compose;
if (process.env.NODE_ENV === 'development') {
    appliedCompose = composeWithDevTools;
    const {logger} = require('redux-logger');
    middlewares.push(logger);
}

export default function configureStore() {
    return createStore(
        rootReducer,
        appliedCompose(
            applyMiddleware(...middlewares)
        )
    );
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
