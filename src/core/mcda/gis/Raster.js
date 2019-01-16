import {BoundingBox, GridSize} from '../../geometry';
import {cloneDeep} from 'lodash';
import {distanceBetweenCoordinates} from 'services/geoTools/distance';

class Raster {
    _boundingBox = null;
    _gridSize = new GridSize(10, 10);
    _data = [];
    _initial = {
        boundingBox: null,
        gridSize: new GridSize(10, 10),
        data: []
    };

    static fromObject(obj) {
        const raster = new Raster();
        raster.boundingBox = obj.boundingBox ? BoundingBox.fromArray(obj.boundingBox) : null;
        raster.data = obj.data;
        raster.gridSize = GridSize.fromObject(obj.gridSize);
        raster.initial = obj.initial;
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

    get initial() {
        return this._initial;
    }

    initialToObject() {
        return {
            boundingBox: this._initial.boundingBox ? this._initial.boundingBox.toArray() : null,
            data: this._initial.data,
            gridSize: this._initial.gridSize.toObject()
        }
    }

    set initial(value) {
        this._initial.boundingBox = value.boundingBox ? BoundingBox.fromArray(value.boundingBox) : null;
        this._initial.gridSize = GridSize.fromObject(value.gridSize);
        this._initial.data = value.data;
    }

    toObject() {
        return {
            boundingBox: this.boundingBox ? this.boundingBox.toArray() : null,
            data: this.data,
            gridSize: this.gridSize.toObject(),
            initial: this.initialToObject()
        }
    }

    sliceByBoundingBox(boundingBox) {
        if (!(boundingBox instanceof BoundingBox)) {
            throw new Error('Viewport expected to be of type BoundingBox.');
        }

        const dataBounds = this.boundingBox.getBoundsLatLng();
        const gridSize = this.gridSize.toObject();
        const viewport = boundingBox.getBoundsLatLng(); //this.leafletMap.current.leafletElement.getBounds();
        const data = cloneDeep(this.data);

        const southWest = {
            y1: dataBounds[0][0],
            x1: dataBounds[0][1],
            y2: viewport._southWest.lat,
            x2: viewport._southWest.lng
        };

        const northEast = {
            y1: dataBounds[1][0],
            x1: dataBounds[1][1],
            y2: viewport._northEast.lat,
            x2: viewport._northEast.lng,
        };

        const distanceX = distanceBetweenCoordinates(southWest.y1, southWest.x1, southWest.y1, northEast.x1);
        const cellSizeX = distanceX / gridSize.n_x;

        const distanceY = distanceBetweenCoordinates(southWest.y1, southWest.x1, northEast.y1, southWest.x1);
        const cellSizeY = distanceY / gridSize.n_y;

        let bounds = cloneDeep(dataBounds);
        let newGridSize = cloneDeep(gridSize);
        let cellsX1 = 0;
        let cellsX2 = gridSize.n_x;
        let cellsY1 = 0;
        let cellsY2 = gridSize.n_y;

        // BoundingBox is not in viewport:
        if (southWest.x2 > northEast.x1 || northEast.x2 < southWest.x1 || southWest.y2 > northEast.y1 || northEast.y2 < southWest.y1) {
            return;
        }

        // BoundingBox is completely in viewport:
        if (southWest.y2 < southWest.y1 && southWest.x2 < southWest.x1 && northEast.y2 > northEast.y1 && northEast.x2 > northEast.x1) {

        }

        // BoundingBox is partially in viewport:
        if (southWest.y2 > southWest.y1) {
            const distance = distanceBetweenCoordinates(southWest.y1, southWest.x1, southWest.y2, southWest.x1);
            cellsY2 = gridSize.n_y - Math.floor(distance / cellSizeY);
            bounds[0][0] = southWest.y2;
        }
        if (northEast.y2 < northEast.y1) {
            const distance = distanceBetweenCoordinates(northEast.y1, northEast.x1, northEast.y2, northEast.x1);
            cellsY1 = Math.floor(distance / cellSizeY);
            bounds[1][0] = northEast.y2;
        }
        if (southWest.x2 > southWest.x1) {
            const distance = distanceBetweenCoordinates(southWest.y1, southWest.x1, southWest.y1, southWest.x2);
            cellsX1 = Math.floor(distance / cellSizeX);
            bounds[0][1] = southWest.x2;
        }
        if (northEast.x2 < northEast.x1) {
            const distance = distanceBetweenCoordinates(northEast.y1, southWest.x1, northEast.y1, northEast.x2);
            cellsX2 = Math.floor(distance / cellSizeX);
            bounds[1][1] = northEast.x2;
        }

        const sliced = data.slice(cellsY1, cellsY2 + 1).map(i => i.slice(cellsX1, cellsX2 + 8));

        newGridSize.n_y = sliced.length;
        if (sliced.length === 0 || sliced[0].length === 0) {
            return;
        }
        newGridSize.n_x = sliced[0].length;

        this.data = sliced;
        this.boundingBox = boundingBox.fromArray(bounds);
        this.gridSize = GridSize.fromObject(newGridSize);
    }

}

export default Raster;