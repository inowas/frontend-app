import {IBoundingBox} from '../../geometry/BoundingBox.type';
import {ICells} from '../../geometry/Cells.type';
import {IGridSize} from '../../geometry/GridSize.type';
import {IRasterLayer} from './RasterLayer.type';
import {IVectorLayer} from './VectorLayer.type';

export interface IGis {
    activeCells: ICells;
    boundingBox: IBoundingBox;
    gridSize: IGridSize;
    rasterLayer: IRasterLayer;
    vectorLayers: IVectorLayer[];
}
