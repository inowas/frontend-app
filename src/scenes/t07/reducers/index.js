import {combineReducers} from 'redux';
import baseModel from './baseModel';
import results from './results';
import scenarios from './scenarios';
import scenarioAnalysis from './scenarioAnalysis';

const T07 = combineReducers({
    baseModel,
    results,
    scenarios,
    scenarioAnalysis
});

export default T07;
