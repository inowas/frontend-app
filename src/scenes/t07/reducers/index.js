import {combineReducers} from 'redux';
import boundaries from './boundaries';
import models from './models';
import scenarioAnalysis from './scenarioAnalysis';

const T07 = combineReducers({
    boundaries,
    models,
    scenarioAnalysis
});

export default T07;
