import {IRule} from './criteria/Rule.type';
import {IRaster} from './gis/Raster.type';

export interface ISuitability {
    raster: IRaster;
    rules: IRule[];
}
