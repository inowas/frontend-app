import {IBoundingBox} from '../../geometry/BoundingBox.type';
import {ICells} from '../../geometry/Cells.type';
import {IGridSize} from '../../geometry/GridSize.type';
import {IRasterLayer, IRasterLayer1v0} from './RasterLayer.type';
import {IVectorLayer} from './VectorLayer.type';

export interface IGis {
    activeCells: ICells;
    boundingBox: IBoundingBox;
    rasterLayer: IRasterLayer;
    vectorLayers: IVectorLayer[];
}

export interface IGis1v0 {
    areas: IVectorLayer[];
    boundingBox: IBoundingBox;
    cells: ICells;
    gridSize: IGridSize;
    raster: IRasterLayer1v0;
}