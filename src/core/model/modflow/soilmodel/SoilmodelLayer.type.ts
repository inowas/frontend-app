import {Array2D} from '../../geometry/Array2D.type';
import {ILayerParameter, ILayerParameter2v0} from './LayerParameter.type';
import {ILayerParameterZone} from './LayerParameterZone.type';
import {IZoneLegacy} from './Zone.type';

export interface ISoilmodelLayer {
    id: string;
    name: string;
    description: string;
    number: number;
    layavg: number;
    laytyp: number;
    laywet: number;
    parameters: ILayerParameter[];
    relations: ILayerParameterZone[];
}

export interface ISoilmodelLayer2v0 {
    id: string;
    name: string;
    description: string;
    number: number;
    layavg: number;
    laytyp: number;
    laywet: number;
    parameters: ILayerParameter2v0[];
}

export interface ISoilmodelLayer1v0 {
    id: string;
    name: string;
    _meta: {
        zones: IZoneLegacy[];
    };
    description: string;
    number: number;
    laytyp: number;
    top: number | Array2D<number>;
    botm: number | Array2D<number>;
    hk: number | Array2D<number>;
    hani: number | Array2D<number>;
    vka: number | Array2D<number>;
    layavg: number;
    laywet: number;
    ss: number | Array2D<number>;
    sy: number | Array2D<number>;
}

export interface ISoilmodelLayerExport {
    name: string;
    description: string;
    number: number;
    laytyp: number;
    top: number | Array2D<number>;
    botm: number | Array2D<number>;
    hk: number | Array2D<number>;
    hani: number | Array2D<number>;
    vka: number | Array2D<number>;
    layavg: number;
    laywet: number;
    ss: number | Array2D<number>;
    sy: number | Array2D<number>;
}
