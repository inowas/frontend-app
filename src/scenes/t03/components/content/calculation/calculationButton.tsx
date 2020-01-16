import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button} from 'semantic-ui-react';
import {Calculation, ModflowModel} from '../../../../../core/model/modflow';
import {IRootReducer} from '../../../../../reducers';
import {startCalculation} from '../../../actions/actions';
import {CALCULATION_STATE_FINISHED} from './CalculationStatus';

const calculationButton = () => {

    const model: null | ModflowModel = useSelector(
        (state: IRootReducer) => state.T03.model ? ModflowModel.fromObject(state.T03.model) : null
    );

    if (!model || model.readOnly) {
        return null;
    }

    const calculation: null | Calculation = useSelector(
        (state: IRootReducer) => state.T03.calculation ? Calculation.fromObject(state.T03.calculation) : null
    );

    const dispatch = useDispatch();

    return (
        <Button
            positive={true}
            fluid={true}
            onClick={dispatch(startCalculation)}
            disabled={model.readOnly}
            loading={calculation ? calculation.state < CALCULATION_STATE_FINISHED : false}
        >
            Calculate
        </Button>
    );
};

export default calculationButton;
