import {IBoundary} from '../../../core/model/modflow/boundaries/Boundary.type';
import {ICalculation} from '../../../core/model/modflow/Calculation.type';
import {IModflowModel} from '../../../core/model/modflow/ModflowModel.type';
import {IScenarioAnalysis} from '../../../core/model/scenarioAnalysis/ScenarioAnalysis';
import {ISoilmodel} from '../../../core/model/modflow/soilmodel/Soilmodel.type';
import {combineReducers} from 'redux';
import boundaries from './boundaries';
import calculations from './calculations';
import models from './models';
import scenarioAnalysis from './scenarioAnalysis';
import soilmodels from './soilmodels';

const T07 = combineReducers({
    boundaries,
    calculations,
    models,
    scenarioAnalysis,
    soilmodels
});

export default T07;

export interface IT07Reducer {
    boundaries: {[id: string]: { data: IBoundary[], isLoading: boolean}};
    calculations: {[id: string]: ICalculation};
    models: {[id: string]: IModflowModel};
    scenarioAnalysis: IScenarioAnalysis;
    soilmodels: {[id: string]: ISoilmodel};
}
