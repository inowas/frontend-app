import {CLEAR, UPDATE_HTM, UPDATE_HTM_INPUT} from '../reducers/htm';
import {IDateTimeValue} from '../../../core/model/rtm/Sensor.type';
import {IToolInstance} from '../../types';
import {UPDATE_DATA} from '../reducers/data';
import {UPDATE_T10_INSTANCES} from '../reducers/t10instances';
import Htm from '../../../core/model/htm/Htm';
import HtmInput from '../../../core/model/htm/HtmInput';

export function clear() {
    return {
        type: CLEAR
    };
}

export function updateData(payload: {type: string, data: IDateTimeValue[] | null}) {
    return {
        type: UPDATE_DATA,
        payload
    };
}

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
    };
}

export function updateT10Instances(instances: IToolInstance[]) {
    return {
        type: UPDATE_T10_INSTANCES,
        payload: instances
    };
}
