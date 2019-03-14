import React from 'react';
import PropTypes from 'prop-types';
import {Progress} from 'semantic-ui-react';

export const CALCULATION_STATE_QUEUED = 0;
export const CALCULATION_STATE_CALCULATING = 100;
export const CALCULATION_STATE_FINISHED = 200;
export const CALCULATION_STATE_ERROR_MODEL = 400;
export const CALCULATION_STATE_ERROR_SERVER = 500;

const CalculationStatus = ({calculation}) => (
    <Progress value={calculation.state} total={3} success={calculation.state === 3}>
        {calculation.state === CALCULATION_STATE_QUEUED && 'Queued...'}
        {calculation.state === CALCULATION_STATE_CALCULATING && 'Calculating...'}
        {calculation.state === CALCULATION_STATE_FINISHED && 'Calculation finished!'}
    </Progress>
);

CalculationStatus.propTypes = {
    calculation: PropTypes.object
};

export default CalculationStatus;
