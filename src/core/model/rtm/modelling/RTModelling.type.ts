import {IBoundary} from '../../modflow/boundaries/Boundary.type';
import {IModflowModel} from '../../modflow/ModflowModel.type';
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
    calculation_id?: string;
    start_date_time: string;
    time_resolution: ETimeResolution;
    simulated_times: number[];
    head?: IRTModellingHead[];
    // TODO: transport and observation_wells
    transport?: any;
    observation_wells?: any;
    results?: IRtModellingResults | null;
}

export type ArrayOfMethods = Array<IMethod | IMethodSensor | IMethodFunction>;

export type RTModellingObservationPoint = {[key: string]: ArrayOfMethods};

export interface IRTModellingHead {
    boundary_id: string;
    data: ArrayOfMethods | RTModellingObservationPoint;
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

export interface IRtModellingResults {
    boundaries: IBoundary[];
    model: IModflowModel;
}