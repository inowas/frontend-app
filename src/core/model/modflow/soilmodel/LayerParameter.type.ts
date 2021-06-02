import {Array2D} from '../../geometry/Array2D.type';
import {RasterDataDropperData} from './types';

export interface ILayerParameter {
    id: string;
    data: RasterDataDropperData;
    value?: number | Array2D<number>;
}
