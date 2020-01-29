import React from 'react';
import {Progress} from 'semantic-ui-react';
import {
    OPTIMIZATION_STATE_CALCULATING,
    OPTIMIZATION_STATE_FINISHED,
    OPTIMIZATION_STATE_NEW,
    OPTIMIZATION_STATE_PREPROCESSING,
    OPTIMIZATION_STATE_PREPROCESSING_FINISHED,
    OPTIMIZATION_STATE_QUEUED,
    OPTIMIZATION_STATE_STARTED,
} from '../../../defaults/optimization';

const optimizationStatus = (props: {state: number}) => (
    <Progress value={props.state} total={6} success={props.state === 6}>
        {props.state === OPTIMIZATION_STATE_NEW && ''}
        {props.state === OPTIMIZATION_STATE_STARTED && 'Started...'}
        {props.state === OPTIMIZATION_STATE_PREPROCESSING && 'Preprocessing...'}
        {props.state === OPTIMIZATION_STATE_PREPROCESSING_FINISHED && 'Preprocessing finished...'}
        {props.state === OPTIMIZATION_STATE_QUEUED && 'Queued...'}
        {props.state === OPTIMIZATION_STATE_CALCULATING && 'Calculating...'}
        {props.state === OPTIMIZATION_STATE_FINISHED && 'Optimization finished!'}
    </Progress>
);

export default optimizationStatus;
