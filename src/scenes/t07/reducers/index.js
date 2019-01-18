import {combineReducers} from 'redux';
import models from './models';
import scenarioAnalysis from './scenarioAnalysis';

const T07 = combineReducers({
    models,
    scenarioAnalysis
});

export default T07;
