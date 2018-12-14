import {UPDATE_BOUNDARIES} from '../reducers/boundaries';
import {UPDATE_MODEL, UPDATE_STRESSPERIODS} from '../reducers/model';
import {
    ADD_SOILMODEL_LAYER,
    REMOVE_SOILMODEL_LAYER,
    UPDATE_SOILMODEL,
    UPDATE_SOILMODEL_LAYER
} from '../reducers/soilmodel';

import {ModflowModel, Stressperiods} from 'core/model/modflow';
import {BoundaryCollection} from 'core/model/modflow/boundaries';
import {Soilmodel, SoilmodelLayer} from 'core/model/modflow/soilmodel';

export function updateModel(modflowModel) {
    if (!(modflowModel instanceof ModflowModel)) {
        throw new Error('ModflowModel is expected to be instance of ModflowModel');
    }

    return {
        type: UPDATE_MODEL,
        model: modflowModel.toObject()
    };
}

export function updateStressperiods(stressperiods) {
    if (!(stressperiods instanceof Stressperiods)) {
        throw new Error('Stressperiods is expected to be instance of Stressperiods');
    }

    return {
        type: UPDATE_STRESSPERIODS,
        payload: stressperiods.toObject()
    };
}

export function updateBoundaries(boundaryCollection) {
    if (!(boundaryCollection instanceof BoundaryCollection)) {
        throw new Error('BoundaryCollection is expected to be instance of BoundaryCollection');
    }

    return {
        type: UPDATE_BOUNDARIES,
        boundaries: boundaryCollection.toObject()
    };
}

export function addSoilmodelLayer(layer) {
    if (!layer instanceof SoilmodelLayer) {
        throw new Error('Layer is expected to be instance of SoilmodelLayer');
    }

    return {
        type: ADD_SOILMODEL_LAYER,
        layer: layer.toObject()
    };
}

export function removeSoilmodelLayer(layer_id) {
    return {
        type: REMOVE_SOILMODEL_LAYER,
        layer_id: layer_id
    }
}

export function updateSoilmodel(soilmodel) {
    if (!soilmodel instanceof Soilmodel) {
        throw new Error('Soilmodel is expected to be instance of Soilmodel');
    }

    return {
        type: UPDATE_SOILMODEL,
        soilmodel: soilmodel.toObject()
    };
}

export function updateSoilmodelLayer(layer) {
    if (!layer instanceof SoilmodelLayer) {
        throw new Error('Layer is expected to be instance of SoilmodelLayer');
    }

    return {
        type: UPDATE_SOILMODEL_LAYER,
        layer: layer.toObject()
    };
}
