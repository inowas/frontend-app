import {IBoundingBox} from '../../geometry/BoundingBox.type';
import {ICells} from '../../geometry/Cells.type';
import {IGridSize} from '../../geometry/GridSize.type';
import {IGisArea} from './GisArea.type';
import {IRaster} from './Raster.type';

export interface IGisMap {
    activeCells: ICells;
    boundingBox: IBoundingBox;
    areas: IGisArea[];
    gridSize: IGridSize;
    raster: IRaster;
}
