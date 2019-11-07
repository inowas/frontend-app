import {IDataDropperData} from '../../../../services/dataDropper/DataDropper.type';
import {Array2D} from '../../geometry/Array2D.type';

export type ZonesOrderChange = 'up' | 'down';

export type RasterDataDropperData = IDataDropperData<Array2D<number>>;
