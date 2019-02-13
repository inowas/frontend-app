import {BoundingBox, GridSize} from '../../geometry';
import {cloneDeep} from 'lodash';
import {distanceBetweenCoordinates} from 'services/geoTools/distance';
import uuidv4 from 'uuid/v4';
import {max, min, rainbowFactory} from 'scenes/shared/rasterData/helpers';

class Raster {
    _boundingBox = new BoundingBox(0, 0, 0, 0);
    _gridSize = new GridSize(10, 10);
    _data = [];
    _id = uuidv4();
    _initial = {
        boundingBox: new BoundingBox(),
        gridSize: new GridSize(10, 10),
        data: []
    };
    _min = 0;
    _max = 0;

    static fromObject(obj) {
        const raster = new Raster();
        raster.id = obj.id || uuidv4();
        raster.boundingBox = BoundingBox.fromArray(obj.boundingBox);
        raster.data = obj.data;
        raster.gridSize = GridSize.fromObject(obj.gridSize);
        raster.initial = obj.initial;
        raster.min = obj.min;
        raster.max = obj.max;
        return raster;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
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

    get min() {
        return this._min;
    }

    set min(value) {
        this._min = value;
    }

    get max() {
        return this._max;
    }

    set max(value) {
        this._max = value;
    }

    initialToObject() {
        return {
            boundingBox: this._initial.boundingBox.toArray(),
            data: this._initial.data,
            gridSize: this._initial.gridSize.toObject()
        }
    }

    set initial(value) {
        this._initial.boundingBox = BoundingBox.fromArray(value.boundingBox);
        this._initial.gridSize = GridSize.fromObject(value.gridSize);
        this._initial.data = value.data;
    }

    toObject() {
        return {
            boundingBox: this.boundingBox.toArray(),
            data: this.data,
            gridSize: this.gridSize.toObject(),
            id: this.id,
            initial: this.initialToObject(),
            max: this.max,
            min: this.min
        }
    }

    calculateMinMax() {
        this.max = max(this.data);
        this.min = min(this.data);
    }

    generateRainbow(colors, fixedInterval = false) {
        return rainbowFactory({min: fixedInterval ? fixedInterval[0] : this.min, max: fixedInterval ? fixedInterval[1] : this.max}, colors);
    }

    assignMinMax() {
        const offsetOld = min(this.data) < 0 ? Math.abs(min(this.data)) : 0;
        const offsetNew = this.min < 0 ? Math.abs(this.min) : 0;

        this.data = cloneDeep(this.data).map(row => {
            return row.map(value => {
                const factor = (value + offsetOld) / (max(this.data) + offsetOld);
                return (factor * (this.max + offsetNew)) - offsetNew;
            });
        });
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