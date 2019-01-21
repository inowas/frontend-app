import {isEqual} from 'lodash';

class GridSize {

    _nX = null;
    _nY = null;

    static fromNxNy(nX, nY) {
        return new GridSize(nX, nY);
    }

    static fromObject({n_x, n_y}) {
        return new GridSize(n_x, n_y);
    }

    static fromData(data) {

        if (!Array.isArray(data)) {
            throw new Error('Data should be an array.');
        }

        const nY = data.length;
        if (nY <= 0) {
            throw new Error('Data should contain more then 0 rows.');
        }

        if (!Array.isArray(data[0])) {
            throw new Error('Data should be a 2D array, only 1D found');
        }

        const nX = data[0].length;
        if (nX <= 0) {
            throw new Error('Data should contain more then 0 cols.');
        }

        return new GridSize(nX, nY);
    }

    constructor(nX, nY) {
        this._nX = nX;
        this._nY = nY;
    }

    get nX() {
        return this._nX;
    }

    get nY() {
        return this._nY;
    }

    set nX(value) {
        this._nX = parseInt(value) || 0;
    }

    set nY(value) {
        this._nY = parseInt(value) || 0;
    }

    toObject = () => ({
        n_x: this._nX,
        n_y: this._nY
    });

    sameAs = (obj) => {
        return isEqual(obj.toObject(), this.toObject());
    };

    isWithIn = (x, y) => {
        return (x >= 0 && x <= this.nX && y >= 0 && y <= this.nY);
    }
}

export default GridSize;
