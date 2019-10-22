import {IMetaData, ISimpleTool} from '../types';
import {ISensor} from './Sensor.type';

export interface IRtm extends ISimpleTool<IRtmData> {
    data: IRtmData;
}

// tslint:disable-next-line:no-empty-interface
export interface IModel extends IMetaData {
}

export interface IRtmData {
    sensors: ISensor[];
    model: string | null;
}
