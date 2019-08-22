import {Array2D} from '../../geometry/Array2D.type';
import {ILayer} from '../../gis/Layer.type';
import {ILayerParameter} from '../../gis/LayerParameter.type';
import {IZoneLegacy} from '../../gis/Zone.type';

export interface ISoilmodelLayer extends ILayer {
    id: string;
    name: string;
    description: string;
    number: number;
    layavg: number;
    laytyp: number;
    laywet: number;
    parameters: ILayerParameter[];
}

export interface ISoilmodelLayerLegacy {
    id: string;
    name: string;
    _meta: {
        'zones': IZoneLegacy[];
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
