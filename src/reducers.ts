import {combineReducers} from 'redux';
import dashboard from './scenes/dashboard/reducers';
import T03, {IT03Reducer} from './scenes/t03/reducers';
import T07 from './scenes/t07/reducers';
import {session, user} from './scenes/user/reducers';
import {IUserReducer} from './scenes/user/reducers/user';

const rootReducer = combineReducers<IRootReducer>({
    dashboard,
    session,
    T03,
    T07,
    user,
});

export default rootReducer;

export interface IRootReducer {
    dashboard: any;
    session: any;
    T03: IT03Reducer;
    T07: any;
    user: IUserReducer;
}
