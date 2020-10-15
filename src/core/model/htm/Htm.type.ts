import {ISimpleTool} from '../types';

export interface IHtm extends ISimpleTool<IHtmData> {
    data: IHtmData;
}

export interface IHtmData {
    input: IHeatTransportInput[];
    options: IHeatTransportRequestOptions;
    results?: IHeatTransportResults;
}

export type TDateValueArray = Array<{date: string; value: number}>;

export interface IHeatTransportInput {
    id: string;
}

export interface IHeatTransportRequestOptions {
    retardation_factor: number;
    sw_monitoring_id: string;
    gw_monitoring_id: string;
    limits: [number, number];
    tolerance: number;
    debug: boolean;
}

export interface IHeatTransportRequest extends IHeatTransportRequestOptions {
    data_sw_selected: TDateValueArray;
    data_gw_selected: TDateValueArray;
}

export interface IHeatTransportResults {
    data: Array<{
        date: string;
        label: string;
        monitoring_id: string;
        observed: number;
        simulated: number;
        simulated_pi_lower: number;
        simulated_pi_upper: number;
        type: string;
    }>;
    gof: Array<{type: string} & {[key: string]: number}>;
    paras: Array<{type: string} & {[key: string]: number}>;
    points: Array<{
        date: string;
        day_number: number;
        label: string;
        observed: number;
        point_type: string;
        simulated: number;
    }>;
    traveltimes: Array<{
        point_type: string;
        retardation_factor: number;
        traveltime_hydraulic_days: number;
        traveltime_thermal_days: number;
    } & {[key: string]: string}>;
}
