import {combineReducers} from 'redux';
import {user, session} from '../user/reducers';
import {routerReducer as routing} from 'react-router-redux';

const rootReducer = combineReducers({
    routing,
    session,
    user
});

export default rootReducer;
