import {Array2D} from '../../geometry/Array2D.type';
import {IBoundingBox} from '../../geometry/BoundingBox.type';
import {IGridSize} from '../../geometry/GridSize.type';

export interface IRaster {
    boundingBox: IBoundingBox;
    gridSize: IGridSize;
    data: Array2D<number>;
    id: string;
    isFetching: boolean;
    min: number;
    max: number;
    url: string;
}
