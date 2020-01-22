import {XYDataPoint} from 'downsample/dist/types';
import {ISensor, ISensorParameter} from '../../../../core/model/rtm/Sensor.type';

export interface IParameterWithMetaData {
    data: XYDataPoint[];
    meta: {
        active: boolean;
        color: string;
    };
    parameter: ISensorParameter;
    sensor: ISensor;
}
