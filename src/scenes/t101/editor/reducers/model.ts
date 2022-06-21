import { Calculation, ModflowModel } from '../../../../core/model/modflow';
import { ICalculation } from '../../../../core/model/modflow/Calculation.type';
import { IModflowModel } from '../../../../core/model/modflow/ModflowModel.type';
import { LOGOUT, UNAUTHORIZED } from '../../../user/actions/actions';
import { UPDATE_CALCULATION } from '../../../t100/reducers/calculation';

export const CLEAR = 'MARPRO_CLEAR';
export const UPDATE_MODEL = 'MARPRO_UPDATE_MODEL';
export const UPDATE_STRESSPERIODS = 'MARPRO_UPDATE_STRESSPERIODS';

const initialState = null;

interface IModelAction {
  type: string;
  model: IModflowModel;
  payload: ICalculation;
}

const model = (state: IModflowModel | null = initialState, action: IModelAction) => {
  switch (action.type) {
    case CLEAR:
      return null;

    case UPDATE_MODEL:
      return {
        ...state,
        ...action.model,
      };

    case UPDATE_CALCULATION:
      if (state) {
        const m = ModflowModel.fromObject(state);
        const calculation = Calculation.fromObject(action.payload);
        m.calculationId = calculation.id;
        return {
          ...state,
          ...m.toObject(),
        };
      }
      break;

    case UNAUTHORIZED:
    case LOGOUT: {
      return initialState;
    }

    default:
      return state;
  }
};

export default model;
