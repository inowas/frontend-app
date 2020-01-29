import React from 'react';
import {Progress} from 'semantic-ui-react';
import {Calculation} from '../../../../../core/model/modflow';

export const CALCULATION_STARTED = 0;
export const CALCULATION_STATE_PREPROCESSING = 1;
export const CALCULATION_STATE_UPDATING_PACKAGES = 2;
export const CALCULATION_STATE_SENDING_DATA = 3;
export const CALCULATION_STATE_WAITING_FOR_CALCULATION = 4;
export const CALCULATION_STATE_CALCULATING = 100;
export const CALCULATION_STATE_CALCULATION_FINISHED = 200;
export const CALCULATION_STATE_CALCULATION_ERROR_MODEL = 400;
export const CALCULATION_STATE_CALCULATION_ERROR_SERVER = 500;

interface IProps {
    calculation: Calculation;
}

const calculationProgress = (props: IProps) => (
    <Progress
        value={props.calculation.state}
        total={7}
        success={props.calculation.state === CALCULATION_STATE_CALCULATION_FINISHED}
    >
        {props.calculation.state === CALCULATION_STARTED && 'Calculation Process started.'}
        {props.calculation.state === CALCULATION_STATE_UPDATING_PACKAGES && 'Updating Packages...'}
        {props.calculation.state === CALCULATION_STATE_PREPROCESSING && 'Preprocessing...'}
        {props.calculation.state === CALCULATION_STATE_SENDING_DATA && 'Sending Data...'}
        {props.calculation.state === CALCULATION_STATE_WAITING_FOR_CALCULATION && 'Queued...'}
        {props.calculation.state === CALCULATION_STATE_CALCULATING && 'Calculating...'}
        {props.calculation.state === CALCULATION_STATE_CALCULATION_FINISHED && 'Finished successfully!'}
        {props.calculation.state === CALCULATION_STATE_CALCULATION_ERROR_MODEL && 'Model error!'}
        {props.calculation.state === CALCULATION_STATE_CALCULATION_ERROR_SERVER && 'Server error!'}
    </Progress>
);

export default calculationProgress;
