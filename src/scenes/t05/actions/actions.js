import {MCDA} from 'core/model/mcda';
import {UPDATE_MCDA} from '../reducers/mcda';

export function updateMcda(mcda) {
    if (!(mcda instanceof MCDA)) {
        throw new Error('MCDA is expected to be instance of MCDA');
    }

    return {
        type: UPDATE_MCDA,
        mcda: mcda.toObject()
    };
}