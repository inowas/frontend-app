import {IPropertyValueObject, ISimpleTool} from '../../types';

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
    head?: IRTModellingHead[];
    // TODO: transport and observation_wells
    transport?: any;
    observation_wells?: any;
}

export type RTModellingObservationPoint = {[key: string]: Array<IMethod | IMethodSensor | IMethodFunction>};

export interface IRTModellingHead {
    boundary_id: string;
    data: Array<IMethod | IMethodSensor | IMethodFunction> | RTModellingObservationPoint;
}

export interface IMethod extends IPropertyValueObject {
    method: EMethodType;
}

export interface IMethodSensor extends IMethod {
    monitoring_id: string;
    sensor_id: string;
    parameter_id: string;
    values?: number[];
}

export interface IMethodFunction extends IMethod {
    function: string;
}