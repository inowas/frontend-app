import {Array2D} from '../../geometry/Array2D.type';
import {IBoundingBox} from '../../geometry/BoundingBox.type';

export interface IRasterLayer {
    boundingBox: IBoundingBox;
    data: Array2D<number>;
    id: string;
    isFetching: boolean;
    min: number;
    max: number;
    url: string;
}
