import {combineReducers} from 'redux';
import {user, session} from './scenes/user/reducers';

const rootReducer = combineReducers({
    session,
    user
});

export default rootReducer;
