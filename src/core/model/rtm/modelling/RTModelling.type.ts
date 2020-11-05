import {ISimpleTool} from '../../types';

export enum EMethodType {
    CONSTANT = 'constant',
    FUNCTION = 'function',
    SENSOR = 'sensor'
}

export enum ETimeResolution {
    DAILY = 'daily'
}

export interface IRtModelling extends ISimpleTool<IRtModellingData> {
    data: IRtModellingData;
}

export interface IRtModellingData {
    model_id: string | null;
    automatic_calculation: boolean;
    start_date_time: string;
    time_resolution: ETimeResolution;
    simulated_times: number[];
    head?: IHead[];
    // TODO: transport and observation_wells
    transport?: any;
    observation_wells?: any;
}

export interface IHead {
    boundary_id: string;
    data: Array<IMethod | IMethodSensor | IMethodFunction> |
        {[key: string]: Array<IMethod | IMethodSensor | IMethodFunction>};
}

export interface IMethod {
    method: EMethodType;
    values: number[][] | number[][][] | null;
}

export interface IMethodSensor extends IMethod {
    monitoring_id: string;
    sensor_id: string;
    parameter_id: string;
}

export interface IMethodFunction extends IMethod {
    function: string;
}