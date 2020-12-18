import {ILayerParameterZone2v0} from './LayerParameterZone.type';
import {IPropertyValueObject} from '../../types';
import {IRasterParameter} from './RasterParameter.type';
import {ISoilmodelLayer, ISoilmodelLayer1v0, ISoilmodelLayer2v0, ISoilmodelLayerExport} from './SoilmodelLayer.type';
import {IZone, IZone2v0} from './Zone.type';

export interface ISoilmodel {
    layers: ISoilmodelLayer[];
    properties: {
        parameters: IRasterParameter[];
        version: string;
        zones: IZone[];
    };
}

export interface ISoilmodel2v0 {
    layers: ISoilmodelLayer2v0[];
    properties: {
        parameters: IRasterParameter[];
        relations: ILayerParameterZone2v0[];
        version?: number;
        zones: IZone2v0[];
    };
}

export interface ISoilmodel1v0 {
    _meta?: IPropertyValueObject;
    general?: {
        wetfct: number
    };
    properties?: IPropertyValueObject;
    layers: ISoilmodelLayer1v0[];
    version?: number;
}

export interface ISoilmodelExport {
    layers: ISoilmodelLayerExport[] | ISoilmodelLayer[];
    properties?: {
        parameters: IRasterParameter[];
        version?: string;
        zones: IZone[];
    };
}
