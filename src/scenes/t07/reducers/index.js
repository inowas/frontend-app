import {combineReducers} from 'redux';
import baseModel from './baseModel';
import scenarios from './scenarios';
import scenarioAnalysis from './scenarioAnalysis';

const T07 = combineReducers({
    baseModel,
    scenarios,
    scenarioAnalysis
});

export default T07;
