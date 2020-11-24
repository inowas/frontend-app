import {IToolInstance} from '../../dashboard/defaults/tools';
import {UPDATE_HTM, UPDATE_HTM_INPUT} from '../reducers/htm';
import {UPDATE_T10_INSTANCES} from '../reducers/t10instances';
import Htm from '../../../core/model/htm/Htm';
import HtmInput from '../../../core/model/htm/HtmInput';

export function updateHtm(htm: Htm) {
    return {
        type: UPDATE_HTM,
        payload: htm.toObject()
    };
}

export function updateHtmInput(input: HtmInput) {
    return {
        type: UPDATE_HTM_INPUT,
        payload: input.toObject()
    }
}

export function updateT10Instances(instances: IToolInstance[]) {
    return {
        type: UPDATE_T10_INSTANCES,
        payload: instances
    }
}