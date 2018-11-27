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
    }
}

export default GridSize;
