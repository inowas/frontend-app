import {CLEAR, UPDATE_QMRA} from '../reducers/qmra';
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
