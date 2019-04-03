import {combineReducers} from 'redux';
import boundaries from './boundaries';
import calculation from './calculation';
import model from './model';
import optimization from './optimization';
import packages from './packages';
import soilmodel from './soilmodel';

const T03 = combineReducers({
    boundaries,
    calculation,
    model,
    optimization,
    packages,
    soilmodel
});

export default T03;
