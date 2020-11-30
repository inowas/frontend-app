import {CLEAR, UPDATE_RTMODELLING} from '../reducers/rtmodelling';
import {IToolInstance} from '../../dashboard/defaults/tools';
import {ModflowModel} from '../../../core/model/modflow';
import {UPDATE_MODEL} from '../reducers/model';
import {UPDATE_T10_INSTANCES} from '../reducers/t10instances';
import RTModelling from '../../../core/model/rtm/modelling/RTModelling';

export function clear() {
    return {
        type: CLEAR
    };
}

export function updateModel(model: ModflowModel) {
    return {
        type: UPDATE_MODEL,
        payload: model.toObject()
    };
}

export function updateRTModelling(rtm: RTModelling) {
    return {
        type: UPDATE_RTMODELLING,
        payload: rtm.toObject()
    };
}

export function updateT10Instances(instances: IToolInstance[]) {
    return {
        type: UPDATE_T10_INSTANCES,
        payload: instances
    };
}