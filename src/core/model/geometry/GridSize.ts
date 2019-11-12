import {isEqual} from 'lodash';
import {GenericObject} from '../genericObject/GenericObject';
import {Array2D} from './Array2D.type';
import {IGridSize} from './GridSize.type';

type IGridSizeArray = [number, number];

class GridSize extends GenericObject<IGridSize> {

    public get nX() {
        return this._props.n_x;
    }

    public set nX(value) {
        this._props.n_x = value || 0;
    }

    public get nY() {
        return this._props.n_y;
    }

    public set nY(value) {
        this._props.n_y = value || 0;
    }

    public static fromNxNy(nX: number, nY: number) {
        return new GridSize({n_x: nX, n_y: nY});
    }

    public static fromArray([nX, nY]: IGridSizeArray) {
        return new GridSize({n_x: nX, n_y: nY});
    }

    public static fromObject({n_x, n_y}: IGridSize) {
        return new GridSize({n_x, n_y});
    }

    public static fromData(data: Array2D<number>) {
        if (data.length === 0) {
            throw new Error('Data expected to have at least one row and one column.');
        }

        return new GridSize({n_x: data[0].length, n_y: data.length});
    }

    public sameAs = (obj: GridSize) => {
        return isEqual(obj.toObject(), this.toObject());
    };

    public isWithIn = (x: number, y: number) => {
        return (x >= 0 && x <= this.nX && y >= 0 && y <= this.nY);
    };
}

export default GridSize;
