import {combineReducers} from 'redux';
import {IFlopyPackages} from '../../../core/model/flopy/packages/FlopyPackages.type';
import {IBoundary} from '../../../core/model/modflow/boundaries/Boundary.type';
import {ICalculation} from '../../../core/model/modflow/Calculation.type';
import {IModflowModel} from '../../../core/model/modflow/ModflowModel.type';
import {ISoilmodel} from '../../../core/model/modflow/soilmodel/Soilmodel.type';
import {ITransport} from '../../../core/model/modflow/transport/Transport.type';
import {IVariableDensity} from '../../../core/model/modflow/variableDensity/VariableDensity.type';
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

export interface IT03Reducer {
    boundaries: IBoundary[];
    calculation: ICalculation;
    model: IModflowModel;
    optimization: any;
    packages: IFlopyPackages;
    soilmodel: ISoilmodel;
    transport: ITransport | undefined;
    variableDensity: IVariableDensity;
}
