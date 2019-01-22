import React from 'react';
import PropTypes from 'prop-types';
import {Progress} from 'semantic-ui-react';

import {
    OPTIMIZATION_STATE_NEW,
    OPTIMIZATION_STATE_STARTED,
    OPTIMIZATION_STATE_PREPROCESSING,
    OPTIMIZATION_STATE_PREPROCESSING_FINISHED,
    OPTIMIZATION_STATE_QUEUED,
    OPTIMIZATION_STATE_CALCULATING,
    OPTIMIZATION_STATE_FINISHED,
} from '../../../defaults/optimization';


const OptimizationStatus = ({state}) => (
    <Progress value={state} total={6} success={state === 6}>
        {state === OPTIMIZATION_STATE_NEW && ''}
        {state === OPTIMIZATION_STATE_STARTED && 'Started...'}
        {state === OPTIMIZATION_STATE_PREPROCESSING && 'Preprocessing...'}
        {state === OPTIMIZATION_STATE_PREPROCESSING_FINISHED && 'Preprocessing finished...'}
        {state === OPTIMIZATION_STATE_QUEUED && 'Queued...'}
        {state === OPTIMIZATION_STATE_CALCULATING && 'Calculating...'}
        {state === OPTIMIZATION_STATE_FINISHED && 'Optimization finished!'}
    </Progress>
);

OptimizationStatus.propTypes = {
    state: PropTypes.number.isRequired
};

export default OptimizationStatus;
