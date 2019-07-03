import {combineReducers} from 'redux';
import boundaries from './boundaries';
import calculation from './calculation';
import model from './model';
import optimization from './optimization';
import packages from './packages';
import soilmodel from './soilmodel';
import transport from './transport';
import variableDensity from './variableDensity';

const T03 = combineReducers({
    boundaries,
    calculation,
    model,
    optimization,
    packages,
    soilmodel,
    transport,
    variableDensity
});

export default T03;
