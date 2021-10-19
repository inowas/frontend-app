import { IRtm } from '../../../core/model/rtm/monitoring/Rtm.type';
import { combineReducers } from 'redux';
import rtm from './rtm';

const T10 = combineReducers({
  rtm,
});

export default T10;

export interface IT10Reducer {
  rtm: IRtm | null;
}
