import React from 'react';
import PropTypes from 'prop-types';
import {Progress} from 'semantic-ui-react';

export const CALCULATION_STATE_NEW = 0;
export const CALCULATION_STATE_STARTED = 1;
export const CALCULATION_STATE_PREPROCESSING = 2;
export const CALCULATION_STATE_PREPROCESSING_FINISHED = 3;
export const CALCULATION_STATE_QUEUED = 4;
export const CALCULATION_STATE_CALCULATING = 5;
export const CALCULATION_STATE_FINISHED = 6;

const CalculationStatus = ({calculation = {state: 0}}) => (
    <Progress value={calculation.state} total={6} success={calculation.state === 6}>
        {calculation.state === CALCULATION_STATE_NEW && ''}
        {calculation.state === CALCULATION_STATE_STARTED && 'Started...'}
        {calculation.state === CALCULATION_STATE_PREPROCESSING && 'Preprocessing...'}
        {calculation.state === CALCULATION_STATE_PREPROCESSING_FINISHED && 'Preprocessing finished...'}
        {calculation.state === CALCULATION_STATE_QUEUED && 'Queued...'}
        {calculation.state === CALCULATION_STATE_CALCULATING && 'Calculating...'}
        {calculation.state === CALCULATION_STATE_FINISHED && 'Calculation finished!'}
    </Progress>
);

CalculationStatus.propTypes = {
    calculation: PropTypes.object
};

export default CalculationStatus;
