import { IBoundary } from '../../../../core/model/modflow/boundaries/Boundary.type';
import { IModflowModel } from '../../../../core/model/modflow/ModflowModel.type';
import { IScenarioTool } from '../../../../core/marPro/Scenario.type';
import { IToolInstance } from '../../../types';
import { combineReducers } from 'redux';
import boundaries from './boundaries';
import model from './model';
import scenario from './scenario';
import t03instances from './t03instances';

const MarProEditorReducer = combineReducers({
  boundaries,
  model,
  scenario,
  t03instances,
});

export default MarProEditorReducer;

export interface IMarProEditorReducer {
  boundaries: IBoundary[];
  model: IModflowModel | null | undefined;
  scenario: IScenarioTool | null;
  t03instances: IToolInstance[];
}
