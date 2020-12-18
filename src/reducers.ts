import {combineReducers} from 'redux';
import dashboard from './scenes/dashboard/reducers';
import T03, {IT03Reducer} from './scenes/t03/reducers';
import T07, {IT07Reducer} from './scenes/t07/reducers';
import T19, {IT19Reducer} from './scenes/t19/reducers';
import dashboard from './scenes/dashboard/reducers';

const rootReducer = combineReducers<IRootReducer>({
    dashboard,
    session,
    T03,
    T07,
    T20,
    T19,
    user,
});

export default rootReducer;

export interface IRootReducer {
    dashboard: any;
    session: ISessionReducer;
    T03: IT03Reducer;
    T07: IT07Reducer;
    T19: IT19Reducer;
    T20: IT20Reducer;
    user: IUserReducer;
}
