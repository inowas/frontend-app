import {IRasterParameter} from './RasterParameter.type';
import {ISoilmodelLayer, ISoilmodelLayerExport} from './SoilmodelLayer.type';
import {IZone} from './Zone.type';

export interface ISoilmodel {
    layers: ISoilmodelLayer[];
    properties: {
        parameters: IRasterParameter[];
        version?: string;
        zones: IZone[];
    };
}

export interface ISoilmodelExport {
    layers: ISoilmodelLayerExport[] | ISoilmodelLayer[];
    properties?: {
        parameters: IRasterParameter[];
        version?: string;
        zones: IZone[];
    };
}
