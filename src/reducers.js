import {combineReducers} from 'redux';
import dashboard from 'scenes/dashboard/reducers';
import T03 from 'scenes/t03/reducers'
import {user, session} from './scenes/user/reducers';
import webData from './services/webData/reducers';

const rootReducer = combineReducers({
    dashboard,
    session,
    T03,
    user,
    webData
});

export default rootReducer;
