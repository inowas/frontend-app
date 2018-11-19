import {combineReducers} from 'redux';
import dashboard from 'scenes/dashboard/reducers';
import {user, session} from './scenes/user/reducers';
import webData from './services/webData/reducers';

const rootReducer = combineReducers({
    dashboard,
    session,
    user,
    webData
});

export default rootReducer;
