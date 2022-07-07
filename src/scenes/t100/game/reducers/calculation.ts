import { CALCULATION_STARTED } from '../../../modflow/components/content/calculation/CalculationProgress';
import { CLEAR } from './model';
import { Calculation } from '../../../../core/model/modflow';
import { ICalculation } from '../../../../core/model/modflow/Calculation.type';
import { LOGOUT, UNAUTHORIZED } from '../../../user/actions/actions';

export const START_CALCULATION = 'MARPRO_START_CALCULATION';
export const UPDATE_CALCULATION = 'MARPRO_UPDATE_CALCULATION';

const initialState = null;

const calculation = (state: ICalculation | null = initialState, action: { type: string; payload?: ICalculation }) => {
  switch (action.type) {
    case CLEAR:
      return initialState;

    case START_CALCULATION:
      return Calculation.fromCalculationIdAndState('', CALCULATION_STARTED).toObject();

    case UPDATE_CALCULATION:
      return action.payload;

    case UNAUTHORIZED:
    case LOGOUT: {
      return initialState;
    }

    default:
      return state;
  }
};

export default calculation;
