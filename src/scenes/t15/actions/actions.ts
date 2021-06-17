import {CLEAR, UPDATE_QMRA} from '../reducers/qmra';
import {UPDATE_QMRA_RESULTS} from '../reducers/results';
import IResults from '../../../core/model/qmra/result/Results.type';
import Qmra from '../../../core/model/qmra/Qmra';

export function clear() {
  return {
    type: CLEAR
  };
}

export function updateQmra(qmra: Qmra) {
  return {
    type: UPDATE_QMRA,
    payload: qmra.toObject()
  };
}

export function updateResults(results: IResults) {
  return {
    type: UPDATE_QMRA_RESULTS,
    payload: results
  };
}
