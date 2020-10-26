import {ISimpleTool} from '../types';
import {ISensor} from './Sensor.type';

export interface IRtm extends ISimpleTool<IRtmData> {
    data: IRtmData;
}

export interface IRtmData {
    sensors: ISensor[];
}
