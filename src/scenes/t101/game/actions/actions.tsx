import { BoundaryCollection, Calculation, ModflowModel, Soilmodel, Transport, VariableDensity } from '../../../../core/model/modflow';
import { CLEAR, UPDATE_MODEL } from '../reducers/model';
import { FlopyPackages } from '../../../../core/model/flopy';
import { PROCESSING_PACKAGES, UPDATE_PACKAGES, UPDATE_PROCESSED_PACKAGES } from '../reducers/packages';
import { START_CALCULATION, UPDATE_CALCULATION } from '../reducers/calculation';
import { UPDATE_BOUNDARIES } from '../reducers/boundaries';
import { UPDATE_GAMESTATE } from '../reducers/gameState';
import { UPDATE_SCENARIO } from '../reducers/scenario';
import { UPDATE_SOILMODEL } from '../reducers/soilmodel';
import { UPDATE_TRANSPORT } from '../reducers/transport';
import { UPDATE_VARIABLE_DENSITY } from '../reducers/variableDensity';
import GameState from '../../../../core/marPro/GameState';
import Scenario from '../../../../core/marPro/Scenario';

export function clear() {
  return {
    type: CLEAR,
  };
}

export function updateModel(modflowModel: ModflowModel) {
  return {
    type: UPDATE_MODEL,
    model: modflowModel.toObject(),
  };
}

export function updateBoundaries(boundaryCollection: BoundaryCollection, setIsDirty = false) {
  return {
    type: UPDATE_BOUNDARIES,
    boundaries: boundaryCollection.toObject(),
    setIsDirty,
  };
}

export function updateTransport(transport: Transport) {
  return {
    type: UPDATE_TRANSPORT,
    payload: transport.toObject(),
  };
}

export function updateVariableDensity(variableDensity: VariableDensity) {
  return {
    type: UPDATE_VARIABLE_DENSITY,
    payload: variableDensity.toObject(),
  };
}

export function updateCalculation(calculation: Calculation) {
  return {
    type: UPDATE_CALCULATION,
    payload: calculation.toObject(),
  };
}

export function updateGameState(gameState: GameState) {
  return {
    type: UPDATE_GAMESTATE,
    payload: gameState.toObject(),
  };
}

export function updatePackages(packages: FlopyPackages) {
  return {
    type: UPDATE_PACKAGES,
    payload: packages.toObject(),
  };
}

export function updateProcessingPackages() {
  return {
    type: PROCESSING_PACKAGES,
  };
}

export function updateProcessedPackages(packages: FlopyPackages) {
  return {
    type: UPDATE_PROCESSED_PACKAGES,
    payload: packages.toObject(),
  };
}

export function updateScenario(scenario: Scenario) {
  return {
    type: UPDATE_SCENARIO,
    payload: scenario.toObject(),
  };
}

export function updateSoilmodel(soilmodel: Soilmodel) {
  return {
    type: UPDATE_SOILMODEL,
    payload: soilmodel.toObject(),
  };
}

export function startCalculation() {
  return {
    type: START_CALCULATION,
  };
}
