import {combineReducers} from 'redux';
import IQmra from '../../../core/model/qmra/Qmra.type';
import IResults from '../../../core/model/qmra/result/Results.type';
import qmra from './qmra';
import results from './results';

const T15 = combineReducers({
  qmra,
  results
});

export default T15;

export interface IT15Reducer {
  qmra: IQmra | null;
  results: IResults | null;
}
