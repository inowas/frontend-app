import {UPDATE_BOUNDARIES} from '../reducers/boundaries';
import {UPDATE_MODEL, UPDATE_STRESSPERIODS} from '../reducers/model';
import {UPDATE_OPTIMIZATION} from '../reducers/optimization';
import {UPDATE_SOILMODEL} from '../reducers/soilmodel';

import {ModflowModel, Stressperiods} from 'core/model/modflow';
import {BoundaryCollection} from 'core/model/modflow/boundaries';
import {Soilmodel} from 'core/model/modflow/soilmodel';
import {Optimization} from 'core/model/modflow/optimization';

export function updateModel(modflowModel) {
    if (!modflowModel instanceof ModflowModel) {
        throw new Error('ModflowModel is expected to be instance of ModflowModel');
    }

    return {
        type: UPDATE_MODEL,
        model: modflowModel.toObject()
    };
}

export function updateStressperiods(stressperiods) {
    if (!stressperiods instanceof Stressperiods) {
        throw new Error('Stressperiods is expected to be instance of Stressperiods');
    }

    return {
        type: UPDATE_STRESSPERIODS,
        payload: stressperiods.toObject()
    };
}

export function updateBoundaries(boundaryCollection) {
    if (!boundaryCollection instanceof BoundaryCollection) {
        throw new Error('BoundaryCollection is expected to be instance of BoundaryCollection');
    }

    return {
        type: UPDATE_BOUNDARIES,
        boundaries: boundaryCollection.toObject()
    };
}

export function updateOptimization(optimization) {
    if (!optimization instanceof Optimization) {
        throw new Error('optimization is expected to be instance of Optimization');
    }

    return {
        type: UPDATE_OPTIMIZATION,
        payload: optimization.toObject()
    }
}

export function updateSoilmodel(soilmodel) {
    if (!soilmodel instanceof Soilmodel) {
        throw new Error('soilmodel is expected to be instance of Soilmodel');
    }

    return {
        type: UPDATE_SOILMODEL,
        soilmodel: soilmodel.toObject()
    };
}
