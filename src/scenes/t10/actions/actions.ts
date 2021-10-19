import { CLEAR, UPDATE_RTM } from '../reducers/rtm';
import { Rtm } from '../../../core/model/rtm/monitoring';

export function clear() {
  return {
    type: CLEAR,
  };
}

export function updateRtm(rtm: Rtm) {
  return {
    type: UPDATE_RTM,
    payload: rtm.toObject(),
  };
}
