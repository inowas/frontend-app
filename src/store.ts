import {applyMiddleware, compose, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

// middleware always needed
const middlewares = [
    thunk,
    unauthorizedMiddleware()
];

let appliedCompose = compose;
if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    appliedCompose = composeWithDevTools;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
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
    return (ref: any) => {
        const {dispatch} = ref;

        return (next: any) => (action: any) => {
            if (
                action.payload && action.payload instanceof Error &&
                action.payload.response && action.payload.response.status === 401
            ) {
                dispatch({
                    type: 'UNAUTHORIZED'
                });
            }

            next(action);
        };
    };
}
