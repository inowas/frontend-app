import {IHtm} from '../../../core/model/htm/Htm.type';
import {IToolInstance} from '../../dashboard/defaults/tools';
import {combineReducers} from 'redux';
import htm from './htm';
import t10instances from './t10instances';

const T19 = combineReducers({
    htm,
    t10instances
});

export default T19;

export interface IT19Reducer {
    htm: IHtm | null;
    t10instances: IToolInstance[];
}
