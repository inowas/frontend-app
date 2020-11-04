import {ITimeUnit} from './TimeUnit.type';

export interface ICalculationParameter {
    idx: number[];
    total_times: number[];
    kstpkper: Array<[number, number]>;
    layers?: number;
}

export interface ICalculation {
    calculation_id: string;
    state: number;
    message: string;
    files: string[];
    times: null | {
        start_date_time: string;
        time_unit: ITimeUnit;
        total_times: number[];
        head: ICalculationParameter;
        budget: ICalculationParameter;
        concentration: ICalculationParameter;
        drawdown: ICalculationParameter;
    }
    layer_values: string[][];
}
