import {IRasterParameter} from './RasterParameter.type';
import {IZone} from './Zone.type';

export interface ILayer {
    id: string;
    name: string;
    _meta: {
        'zones': IZone[];
    };
    description: string;
    number: number;
    laytyp: number;
    layavg: number;
    laywet: number;
    parameters: IRasterParameter[];
}
