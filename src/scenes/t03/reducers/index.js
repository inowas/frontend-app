import {combineReducers} from 'redux';
import boundaries from './boundaries';
import calculation from './calculation';
import model from './model';
import optimization from './optimization';
import soilmodel from './soilmodel';

const T03 = combineReducers({
    model,
    boundaries,
    calculation,
    optimization,
    soilmodel
});

export default T03;
