import {UPDATE_MODEL_BOUNDARIES} from '../reducers/boundaries';
import {UPDATE_MODEL} from '../reducers/models';
import {CLEAR, UPDATE_SCENARIOANALYSIS} from '../reducers/scenarioAnalysis';
import {ScenarioAnalysis} from '../../../core/model/scenarioAnalysis';
import {BoundaryCollection, ModflowModel} from '../../../core/model/modflow';

export function clear() {
    return {
        type: CLEAR
    }
}

export function updateScenarioAnalysis(scenarioAnalysis) {
    if (!(scenarioAnalysis instanceof ScenarioAnalysis)) {
        throw new Error('ScenarioAnalysis is expected to be instance of ScenarioAnalysis');
    }

    return {
        type: UPDATE_SCENARIOANALYSIS,
        payload: scenarioAnalysis.toObject()
    };
}

export function updateModel(modflowModel) {
    if (!(modflowModel instanceof ModflowModel)) {
        throw new Error('ModflowModel is expected to be instance of ModflowModel');
    }

    return {
        type: UPDATE_MODEL,
        payload: modflowModel.toObject()
    };
}

export function updateBoundaries(boundaries, id) {
    if (!(boundaries instanceof BoundaryCollection)) {
        throw new Error('BoundaryCollection is expected to be instance of BoundaryCollection');
    }

    return {
        type: UPDATE_MODEL_BOUNDARIES,
        id,
        payload: boundaries.toObject()
    };
}