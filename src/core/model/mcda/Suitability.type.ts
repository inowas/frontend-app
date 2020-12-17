import {IRasterLayer, IRasterLayer1v0} from './gis/RasterLayer.type';
import {IRule} from './criteria/Rule.type';

export interface ISuitability {
    raster: IRasterLayer;
    rules: IRule[];
}

export interface ISuitability1v0 {
    raster: IRasterLayer1v0;
    rules: IRule[];
}
