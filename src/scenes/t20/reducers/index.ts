import {IModflowModel} from '../../../core/model/modflow/ModflowModel.type';
import {IRtModelling} from '../../../core/model/rtm/modelling/RTModelling.type';
import {IToolInstance} from '../../dashboard/defaults/tools';
import {combineReducers} from 'redux';
import model from './model';
import rtmodelling from './rtmodelling';
import t10instances from './t10instances';

const T20 = combineReducers({
    model,
    rtmodelling,
    t10instances
});

export default T20;

export interface IT20Reducer {
    model: IModflowModel | null;
    rtmodelling: IRtModelling | null;
    t10instances: IToolInstance[];
}
