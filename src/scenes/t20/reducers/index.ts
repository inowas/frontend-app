import {IBoundary} from '../../../core/model/modflow/boundaries/Boundary.type';
import {ICalculation} from '../../../core/model/modflow/Calculation.type';
import {IModflowModel} from '../../../core/model/modflow/ModflowModel.type';
import {IPackagesReducer} from '../../t03/reducers/packages';
import {IRtModelling} from '../../../core/model/rtm/modelling/RTModelling.type';
import {ISoilmodel} from '../../../core/model/modflow/soilmodel/Soilmodel.type';
import {IToolInstance} from '../../types';
import {ITransport} from '../../../core/model/modflow/transport/Transport.type';
import {IVariableDensity} from '../../../core/model/modflow/variableDensity/VariableDensity.type';
import {combineReducers} from 'redux';
import boundaries from './boundaries';
import calculation from './calculation';
import model from './model';
import packages from './packages';
import rtmodelling from './rtmodelling';
import soilmodel from './soilmodel';
import t10instances from './t10instances';
import transport from './transport';
import variableDensity from './variableDensity';

const T20 = combineReducers({
    boundaries,
    calculation,
    model,
    packages,
    rtmodelling,
    soilmodel,
    t10instances,
    transport,
    variableDensity
});

export default T20;

export interface IT20Reducer {
    boundaries: IBoundary[];
    calculation: ICalculation | null | undefined;
    model: IModflowModel | null;
    packages: IPackagesReducer;
    rtmodelling: IRtModelling | null;
    soilmodel: ISoilmodel | null;
    t10instances: IToolInstance[];
    transport: ITransport | null;
    variableDensity: IVariableDensity;
}
