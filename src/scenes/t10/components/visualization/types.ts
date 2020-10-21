// @ts-ignore todo
import {XYDataPoint} from 'downsample/dist/types';
import {ISensor, ISensorParameter} from '../../../../core/model/rtm/Sensor.type';

export interface IParameterWithMetaData {
    data: XYDataPoint[];
    meta: {
        active: boolean;
        color: string;
        axis: 'left' | 'right';
    };
    parameter: ISensorParameter;
    sensor: ISensor;
}

export interface ITimeStamps {
    minT: number;
    maxT: number;
    left: {
        min: number;
        max: number;
    };
    right: {
        min: number;
        max: number;
    };
    timestamps: number[];
}
