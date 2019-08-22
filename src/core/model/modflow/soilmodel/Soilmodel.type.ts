import {ILayer} from '../../gis/Layer.type';
import {ILayerParameterZone} from '../../gis/LayerParameterZone.type';
import {IRasterParameter} from '../../gis/RasterParameter.type';
import {IZone} from '../../gis/Zone.type';
import {IPropertyValueObject} from '../../types';
import {ISoilmodelLayerLegacy} from './SoilmodelLayer.type';

export interface ISoilmodel {
    layers: ILayer[];
    properties: {
        parameters: IRasterParameter[];
        relations: ILayerParameterZone[];
        zones: IZone[];
    };
}

export interface ISoilmodelLegacy {
    _meta?: IPropertyValueObject;
    general?: {
        wetfct: number
    };
    properties?: IPropertyValueObject;
    layers: ISoilmodelLayerLegacy[];
}
