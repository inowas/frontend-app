import {Array2D} from '../../geometry/Array2D.type';
import {RasterDataDropperData} from './types';

export interface ILayerParameterZone {
    data: RasterDataDropperData;
    id: string;
    parameter: string;
    priority: number;
    value?: number | Array2D<number>;
    zoneId: string;
}
