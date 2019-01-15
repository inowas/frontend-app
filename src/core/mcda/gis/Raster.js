import {BoundingBox, GridSize} from '../../geometry';

class Raster {
    _boundingBox = null;
    _gridSize = new GridSize(10, 10);
    _data = [];

    static fromObject(obj) {
        const raster = new Raster();
        raster.boundingBox = BoundingBox.fromArray(obj.boundingBox);
        raster.data = obj.data;
        raster.gridSize = GridSize.fromObject(obj.gridSize);
        return raster;
    }

    get boundingBox() {
        return this._boundingBox;
    }

    set boundingBox(value) {
        this._boundingBox = value;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }

    get gridSize() {
        return this._gridSize;
    }

    set gridSize(value) {
        this._gridSize = value;
    }

    toObject() {
        return {
            boundingBox: this.boundingBox.toArray(),
            data: this.data,
            gridSize: this.gridSize.toObject(),
        }
    }

    aggregateData(map) {
        console.log('MAP', map);
    }

}

export default Raster;