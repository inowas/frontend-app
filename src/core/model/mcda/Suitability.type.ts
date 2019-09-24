import {IRule} from './criteria/Rule.type';
import {IRasterLayer} from './gis/RasterLayer.type';

export interface ISuitability {
    raster: IRasterLayer;
    rules: IRule[];
}
