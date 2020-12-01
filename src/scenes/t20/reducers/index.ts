import {IBoundary} from '../../../core/model/modflow/boundaries/Boundary.type';
import {IModflowModel} from '../../../core/model/modflow/ModflowModel.type';
import {IRtModelling} from '../../../core/model/rtm/modelling/RTModelling.type';
import {IToolInstance} from '../../dashboard/defaults/tools';
import {combineReducers} from 'redux';
import boundaries from './boundaries';
import model from './model';
import rtmodelling from './rtmodelling';
import t10instances from './t10instances';

const T20 = combineReducers({
    boundaries,
    model,
    rtmodelling,
    t10instances
});

export default T20;

export interface IT20Reducer {
    boundaries: IBoundary[];
    model: IModflowModel | null;
    rtmodelling: IRtModelling | null;
    t10instances: IToolInstance[];
}
