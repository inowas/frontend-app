import { IBoundary } from '../../../core/model/modflow/boundaries/Boundary.type';
import { ICalculation } from '../../../core/model/modflow/Calculation.type';
import { IGameState } from '../../../core/marPro/GameState.type';
import { IModflowModel } from '../../../core/model/modflow/ModflowModel.type';
import { IScenario } from '../../../core/marPro/Scenario.type';
import { ISoilmodel } from '../../../core/model/modflow/soilmodel/Soilmodel.type';
import { ITransport } from '../../../core/model/modflow/transport/Transport.type';
import { IVariableDensity } from '../../../core/model/modflow/variableDensity/VariableDensity.type';
import { combineReducers } from 'redux';
import boundaries from './boundaries';
import calculation from './calculation';
import gameState from './gameState';
import model from './model';
import packages, { IPackagesReducer } from './packages';
import scenario from './scenario';
import soilmodel from './soilmodel';
import transport from './transport';
import variableDensity from './variableDensity';

const MarPro = combineReducers({
  boundaries,
  calculation,
  gameState,
  model,
  packages,
  scenario,
  soilmodel,
  transport,
  variableDensity,
});

export default MarPro;

export interface IMarProReducer {
  boundaries: IBoundary[];
  calculation: ICalculation | null | undefined;
  gameState: IGameState | null;
  model: IModflowModel | null | undefined;
  packages: IPackagesReducer;
  scenario: IScenario | null;
  soilmodel: ISoilmodel | null;
  transport: ITransport | null;
  variableDensity: IVariableDensity;
}
