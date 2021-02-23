import {combineReducers} from 'redux';
import IQmra from '../../../core/model/qmra/Qmra.type';
import qmra from './qmra';

const T15 = combineReducers({
  qmra
});

export default T15;

export interface IT15Reducer {
  qmra: IQmra | null;
}
