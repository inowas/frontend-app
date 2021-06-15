import {Array2D} from '../../geometry/Array2D.type';
import {ILayerParameter} from './LayerParameter.type';
import {ILayerParameterZone} from './LayerParameterZone.type';

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
