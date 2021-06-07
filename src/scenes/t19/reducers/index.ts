import {IHtm} from '../../../core/model/htm/Htm.type';
import {IToolInstance} from '../../types';
import {combineReducers} from 'redux';
import data, {IDataState} from './data';
import htm from './htm';
import t10instances from './t10instances';

const T19 = combineReducers({
    data,
    htm,
    t10instances
});

export default T19;

export interface IT19Reducer {
    data: IDataState;
    htm: IHtm | null;
    t10instances: IToolInstance[];
}
