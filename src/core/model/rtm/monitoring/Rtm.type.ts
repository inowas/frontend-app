import {ISensor} from './Sensor.type';
import {ISimpleTool} from '../../types';

export interface IRtm extends ISimpleTool<IRtmData> {
    data: IRtmData;
}

export interface IRtmData {
    sensors: ISensor[];
}
