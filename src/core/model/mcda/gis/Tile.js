import Raster from './Raster';
import {BoundingBox, GridSize} from '../../geometry';
import uuidv4 from 'uuid/v4';

class Tile extends Raster {
    _x = 0;
    _y = 0;

    static fromObject(obj) {
        const raster = new Tile();
        raster.boundingBox = obj.boundingBox ? BoundingBox.fromObject(obj.boundingBox) : new BoundingBox([[0, 0], [1, 1]]);
        raster.gridSize = obj.gridSize ? GridSize.fromObject(obj.gridSize) : new GridSize(10, 10);
        raster.id = obj.id || uuidv4();
        raster.min = obj.min;
        raster.max = obj.max;
        raster.x = obj.x;
        raster.y = obj.y;
        raster.url = obj.url;
        return raster;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    toObject() {
        return {
            boundingBox: this.boundingBox.toObject(),
            gridSize: this.gridSize.toObject(),
            id: this.id,
            max: this.max,
            min: this.min,
            x: this.x,
            y: this.y,
            url: this.url
        }
    }
}

export default Tile;
