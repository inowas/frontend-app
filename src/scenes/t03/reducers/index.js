import {combineReducers} from 'redux';
import boundaries from './boundaries';
import model from './model';
import soilmodel from './soilmodel';

const T03 = combineReducers({
    boundaries,
    model,
    soilmodel
});

export default T03;
