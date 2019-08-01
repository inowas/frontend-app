import {ITimeUnit} from './TimeUnit.type';

export interface ICalculation {
    calculation_id: null | string;
    state: number;
    message: string;
    files: null | string[];
    times: null | {
        start_date_time: string;
        time_unit: ITimeUnit;
        total_times: number[]
    };
    layer_values: null | string[][];
}
