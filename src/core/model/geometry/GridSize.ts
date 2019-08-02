import {isEqual} from 'lodash';
import {Array2D} from './Array2D.type';
import {IGridSize} from './GridSize.type';

type Point = [number, number];

class GridSize {
    public static fromNxNy(nX: number, nY: number) {
        return new GridSize(nX, nY);
    }

    public static fromArray([nX, nY]: Point) {
        return new GridSize(nX, nY);
    }

    public static fromObject({n_x, n_y}: IGridSize) {
        return new GridSize(n_x, n_y);
    }

    public static fromData(data: Array2D<number>) {
        if (data.length === 0) {
            throw new Error('Data expected to have at least one row and one column.');
        }

        return new GridSize(data[0].length, data.length);
    }

    constructor(private _nX: number, private _nY: number) {
    }

    public get nX() {
        return this._nX;
    }

    public set nX(value) {
        this._nX = value || 0;
    }

    public get nY() {
        return this._nY;
    }

    public set nY(value) {
        this._nY = value || 0;
    }

    public toObject = (): IGridSize => ({
        n_x: this._nX,
        n_y: this._nY
    });

    public sameAs = (obj: GridSize) => {
        return isEqual(obj.toObject(), this.toObject());
    };

    public isWithIn = (x: number, y: number) => {
        return (x >= 0 && x <= this.nX && y >= 0 && y <= this.nY);
    };
}

export default GridSize;
