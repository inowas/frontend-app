import {ISoilmodelZone} from './SoilmodelZone.type';

export interface ISoilmodelLayer {
    id: string;
    name: string;
    _meta: {
        'zones': ISoilmodelZone[];
    };
    description: string;
    number: number;
    laytyp: number;
    top: number | number[][];
    botm: number | number[][];
    hk: number | number[][];
    hani: number | number[][];
    vka: number | number[][];
    layavg: number;
    laywet: number;
    ss: number | number[][];
    sy: number | number[][];
}
