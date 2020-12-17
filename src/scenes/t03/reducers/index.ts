import {IBoundary} from '../../../core/model/modflow/boundaries/Boundary.type';
import {ICalculation} from '../../../core/model/modflow/Calculation.type';
import {IMessage} from '../../../core/model/messages/Message.type';
import {IModflowModel} from '../../../core/model/modflow/ModflowModel.type';
import {ISoilmodel} from '../../../core/model/modflow/soilmodel/Soilmodel.type';
import {ITransport} from '../../../core/model/modflow/transport/Transport.type';
import {IVariableDensity} from '../../../core/model/modflow/variableDensity/VariableDensity.type';
import {combineReducers} from 'redux';
import boundaries from './boundaries';
import calculation from './calculation';
import messages from './messages';
import model from './model';
import optimization from './optimization';
import packages, {IPackagesReducer} from './packages';
import soilmodel from './soilmodel';
import transport from './transport';
import variableDensity from './variableDensity';

const T03 = combineReducers({
    boundaries,
    calculation,
    messages,
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
    calculation: ICalculation | null | undefined;
    messages: IMessage[];
    model: IModflowModel | null | undefined;
    optimization: any;
    packages: IPackagesReducer;
    soilmodel: ISoilmodel;
    transport: ITransport | null;
    variableDensity: IVariableDensity;
}
