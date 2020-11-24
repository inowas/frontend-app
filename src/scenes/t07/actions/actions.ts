import {BoundaryCollection} from '../../../core/model/modflow/boundaries';
import {CLEAR, UPDATE_SCENARIOANALYSIS} from '../reducers/scenarioAnalysis';
import {Calculation, ModflowModel} from '../../../core/model/modflow';
import {ScenarioAnalysis} from '../../../core/model/scenarioAnalysis';
import {UPDATE_MODEL} from '../reducers/models';
import {UPDATE_MODEL_BOUNDARIES} from '../reducers/boundaries';
import {UPDATE_MODEL_CALCULATION} from '../reducers/calculations';
import {UPDATE_MODEL_SOILMODEL} from '../reducers/soilmodels';
import Soilmodel from '../../../core/model/modflow/soilmodel/Soilmodel';

export function clear() {
    return {
        type: CLEAR
    };
}

export function updateScenarioAnalysis(scenarioAnalysis: ScenarioAnalysis) {
    return {
        type: UPDATE_SCENARIOANALYSIS,
        payload: scenarioAnalysis.toObject()
    };
}

export function updateModel(modflowModel: ModflowModel, id: string) {
    return {
        type: UPDATE_MODEL,
        id,
        payload: modflowModel.toObject()
    };
}

export function updateBoundaries(boundaries: BoundaryCollection, id: string) {
    return {
        type: UPDATE_MODEL_BOUNDARIES,
        id,
        payload: boundaries.toObject()
    };
}

export function updateCalculation(calculation: Calculation, id: string) {
    return {
        type: UPDATE_MODEL_CALCULATION,
        id,
        payload: calculation.toObject()
    };
}

export function updateSoilmodel(soilmodel: Soilmodel, id: string) {
    return {
        type: UPDATE_MODEL_SOILMODEL,
        id,
        payload: soilmodel.toObject()
    };
}
