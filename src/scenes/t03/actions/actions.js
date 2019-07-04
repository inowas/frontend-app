import {REMOVE_BOUNDARY, UPDATE_BOUNDARIES} from '../reducers/boundaries';
import {UPDATE_CALCULATION} from '../reducers/calculation';
import {CLEAR, UPDATE_MODEL, UPDATE_MT3DMS, UPDATE_STRESSPERIODS} from '../reducers/model';
import {
    ADD_SOILMODEL_LAYER, CLONE_SOILMODEL_LAYER,
    REMOVE_SOILMODEL_LAYER,
    UPDATE_SOILMODEL,
    UPDATE_SOILMODEL_LAYER
} from '../reducers/soilmodel';
import {UPDATE_OPTIMIZATION} from '../reducers/optimization';

import {Calculation, ModflowModel, Stressperiods, Transport, VariableDensity} from '../../../core/model/modflow';
import {BoundaryCollection} from '../../../core/model/modflow/boundaries';
import {Soilmodel, SoilmodelLayer} from '../../../core/model/modflow/soilmodel';
import {FlopyMt3d} from '../../../core/model/flopy/packages/mt';
import {Optimization} from '../../../core/model/modflow/optimization';
import FlopyPackages from '../../../core/model/flopy/packages/FlopyPackages';
import {UPDATE_PACKAGES} from '../reducers/packages';
import {UPDATE_TRANSPORT} from '../reducers/transport';
import {UPDATE_VARIABLE_DENSITY} from '../reducers/variableDensity';

export function clear() {
    return {
        type: CLEAR
    }
}

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

export function removeBoundary(id) {
    return {
        type: REMOVE_BOUNDARY,
        payload: id
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

export function updateTransport(transport) {
    if (!(transport instanceof Transport)) {
        throw new Error('Transport is expected to be instance of Transport');
    }

    return {
        type: UPDATE_TRANSPORT,
        payload: transport.toObject()
    };
}

export function updateVariableDensity(variableDensity) {
    if (!(variableDensity instanceof VariableDensity)) {
        throw new Error('VariableDensity is expected to be instance of VariableDensity');
    }

    return {
        type: UPDATE_VARIABLE_DENSITY,
        payload: variableDensity.toObject()
    };
}

export function updateCalculation(calculation) {
    if (!(calculation instanceof Calculation)) {
        throw new Error('Calculation is expected to be instance of Calculation');
    }

    return {
        type: UPDATE_CALCULATION,
        payload: calculation.toObject()
    };
}

export function updatePackages(packages) {
    if (!(packages instanceof FlopyPackages)) {
        throw new Error('Packages is expected to be instance of FlopyPackages');
    }

    return {
        type: UPDATE_PACKAGES,
        payload: packages.toObject()
    };
}

export function updateMt3dms(mt3dms) {
    if (!mt3dms instanceof FlopyMt3d) {
        throw new Error('FlopyMt3d is expected to be instance of FlopyMt3d');
    }

    return {
        type: UPDATE_MT3DMS,
        payload: mt3dms.toObject()
    };
}

export function addLayer(layer) {
    if (!layer instanceof SoilmodelLayer) {
        throw new Error('Layer is expected to be instance of SoilmodelLayer');
    }

    return {
        type: ADD_SOILMODEL_LAYER,
        layer: layer.toObject()
    };
}

export function cloneLayer(layer_id, new_layer_id) {
    return {
        type: CLONE_SOILMODEL_LAYER,
        layer_id, new_layer_id
    }
}

export function removeLayer(layer_id) {
    return {
        type: REMOVE_SOILMODEL_LAYER,
        layer_id: layer_id
    }
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
        throw new Error('Soilmodel is expected to be instance of Soilmodel');
    }

    return {
        type: UPDATE_SOILMODEL,
        soilmodel: soilmodel.toObject()
    };
}

export function updateLayer(layer) {
    if (!layer instanceof SoilmodelLayer) {
        throw new Error('Layer is expected to be instance of SoilmodelLayer');
    }

    return {
        type: UPDATE_SOILMODEL_LAYER,
        layer: layer.toObject()
    };
}
