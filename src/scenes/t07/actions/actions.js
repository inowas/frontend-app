import {
    UPDATE_MODEL,
    UPDATE_MODEL_BOUNDARIES,
    UPDATE_MODEL_SOILMODEL,
    UPDATE_MODEL_CALCULATION,
    UPDATE_MODEL_RESULTS
} from '../reducers/models';

import {CLEAR, UPDATE_SCENARIOANALYSIS} from '../reducers/scenarioAnalysis';
import {ScenarioAnalysis} from 'core/model/scenarioAnalysis';
import {BoundaryCollection, Calculation, CalculationResults, ModflowModel, Soilmodel} from 'core/model/modflow';

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

export function updateSoilmodel(soilmodel, id) {
    if (!(soilmodel instanceof Soilmodel)) {
        throw new Error('Soilmodel is expected to be instance of Soilmodel');
    }

    return {
        type: UPDATE_MODEL_SOILMODEL,
        id,
        payload: soilmodel.toObject()
    };
}

export function updateCalculation(calculation, id) {
    if (!(calculation instanceof Calculation)) {
        throw new Error('Calculation is expected to be instance of Calculation');
    }

    return {
        type: UPDATE_MODEL_CALCULATION,
        id,
        payload: calculation.toObject()
    };
}

export function updateResults(results, id) {
    if (!(results instanceof CalculationResults)) {
        throw new Error('Results is to be expected to be instance of CalculationResults');
    }

    return {
        type: UPDATE_MODEL_RESULTS,
        id,
        payload: results.toObject()
    };
}
