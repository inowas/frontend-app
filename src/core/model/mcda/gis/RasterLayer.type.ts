import {Array2D} from '../../geometry/Array2D.type';
import {IBoundingBox} from '../../geometry/BoundingBox.type';
import {IGridSize} from '../../geometry/GridSize.type';

export interface IRasterLayer {
    boundingBox: IBoundingBox;
    data: Array2D<number>;
    id: string;
    isFetching: boolean;
    min: number;
    max: number;
    url: string;
}

export interface IRasterLayer1v0 {
    boundingBox: IBoundingBox;
    gridSize: IGridSize;
    id: string;
    max: number;
    min: number;
    url: string;
}
