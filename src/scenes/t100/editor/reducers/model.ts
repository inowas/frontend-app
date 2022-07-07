import { ICalculation } from '../../../../core/model/modflow/Calculation.type';
import { IModflowModel } from '../../../../core/model/modflow/ModflowModel.type';
import { LOGOUT, UNAUTHORIZED } from '../../../user/actions/actions';

export const CLEAR = 'T100_CLEAR';
export const UPDATE_MODEL = 'T100_UPDATE_MODEL';
export const UPDATE_STRESSPERIODS = 'T100_UPDATE_STRESSPERIODS';

const initialState = null;

interface IModelAction {
  type: string;
  model: IModflowModel;
  payload: ICalculation;
}

const model = (state: IModflowModel | null | undefined = initialState, action: IModelAction) => {
  switch (action.type) {
    case CLEAR:
      return null;

    case UPDATE_MODEL:
      return {
        ...state,
        ...action.model,
      };

    case UNAUTHORIZED:
    case LOGOUT: {
      return initialState;
    }

    default:
      return state;
  }
};

export default model;
