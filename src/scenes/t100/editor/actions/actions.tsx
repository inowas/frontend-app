import { BoundaryCollection, ModflowModel } from '../../../../core/model/modflow';
import { CLEAR, UPDATE_MODEL } from '../reducers/model';
import { IToolInstance } from '../../../types';
import { UPDATE_BOUNDARIES } from '../reducers/boundaries';
import { UPDATE_SCENARIO } from '../reducers/scenario';
import { UPDATE_T03_INSTANCES } from '../reducers/t03instances';
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

export function updateScenario(scenario: Scenario) {
  return {
    type: UPDATE_SCENARIO,
    payload: scenario.toObject(),
  };
}

export function updateT03Instances(instances: IToolInstance[]) {
  return {
    type: UPDATE_T03_INSTANCES,
    payload: instances,
  };
}
