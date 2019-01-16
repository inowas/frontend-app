import {UPDATE_BASE_MODEL, UPDATE_BASE_MODEL_BOUNDARIES} from '../reducers/baseModel';
import {UPDATE_SCENARIO, UPDATE_SCENARIO_BOUNDARIES} from '../reducers/scenarios';
import {CLEAR, UPDATE_SCENARIOANALYSIS} from '../reducers/scenarioAnalysis';
import {ScenarioAnalysis} from 'core/model/scenarioAnalysis';
import {BoundaryCollection, ModflowModel} from 'core/model/modflow';

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

export function updateBaseModel(modflowModel) {
    if (!(modflowModel instanceof ModflowModel)) {
        throw new Error('ModflowModel is expected to be instance of ModflowModel');
    }

    return {
        type: UPDATE_BASE_MODEL,
        payload: modflowModel.toObject()
    };
}

export function updateBaseModelBoundaries(boundaries) {
    if (!(boundaries instanceof BoundaryCollection)) {
        throw new Error('BoundaryCollection is expected to be instance of BoundaryCollection');
    }

    return {
        type: UPDATE_BASE_MODEL_BOUNDARIES,
        payload: boundaries.toObject()
    };
}

export function updateBaseModelResults(results) {
}


export function updateScenario(modflowModel) {
    if (!(modflowModel instanceof ModflowModel)) {
        throw new Error('ModflowModel is expected to be instance of ModflowModel');
    }

    return {
        type: UPDATE_SCENARIO,
        id: modflowModel.id,
        payload: modflowModel.toObject()
    };
}

export function updateScenarioBoundaries(boundaries, id) {
    if (!(boundaries instanceof BoundaryCollection)) {
        throw new Error('BoundaryCollection is expected to be instance of BoundaryCollection');
    }

    return {
        type: UPDATE_SCENARIO_BOUNDARIES,
        id: id,
        payload: boundaries.toObject()
    };
}
