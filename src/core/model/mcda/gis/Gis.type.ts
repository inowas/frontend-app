import {IBoundingBox} from '../../geometry/BoundingBox.type';
import {ICells} from '../../geometry/Cells.type';
import {IRasterLayer} from './RasterLayer.type';
import {IVectorLayer} from './VectorLayer.type';

export interface IGis {
    activeCells: ICells;
    boundingBox: IBoundingBox;
    rasterLayer: IRasterLayer;
    vectorLayers: IVectorLayer[];
}
