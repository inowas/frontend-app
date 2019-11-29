import React from 'react';
import {Progress} from 'semantic-ui-react';
import Calculation from '../../../../../core/model/modflow/Calculation';

export const CALCULATION_STATE_NEW = 0;
export const CALCULATION_STATE_QUEUED = 1;
export const CALCULATION_STATE_CALCULATING = 100;
export const CALCULATION_STATE_FINISHED = 200;
export const CALCULATION_STATE_ERROR_MODEL = 400;
export const CALCULATION_STATE_ERROR_SERVER = 500;

interface IProps {
    calculation: Calculation;
}

const calculationStatus = (props: IProps) => (
    <Progress value={props.calculation.state} total={4} success={props.calculation.state === 200}>
        {props.calculation.state === CALCULATION_STATE_NEW && 'Sending data...'}
        {props.calculation.state === CALCULATION_STATE_QUEUED && 'Queued...'}
        {props.calculation.state === CALCULATION_STATE_CALCULATING && 'Calculating...'}
        {props.calculation.state === CALCULATION_STATE_FINISHED && 'Finished successfully!'}
        {props.calculation.state === CALCULATION_STATE_ERROR_MODEL && 'Model error!'}
        {props.calculation.state === CALCULATION_STATE_ERROR_SERVER && 'Server error!'}
    </Progress>
);

export default calculationStatus;
