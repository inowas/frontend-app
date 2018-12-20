import {isEqual} from 'lodash';
import {envelope} from '@turf/turf';

class BoundingBox {

    _xMin = null;
    _xMax = null;
    _yMin = null;
    _yMax = null;

    static fromPoints([[xMin, yMin], [xMax, yMax]]) {
        return new BoundingBox(xMin, xMax, yMin, yMax);
    }

    static fromGeoJson(geoJson) {
        const polygon = envelope(geoJson);
        const coordinates = polygon.geometry.coordinates[0];
        let [xMin, yMin] = coordinates[0];
        let [xMax, yMax] = coordinates[0];

        coordinates.forEach(c => {
            if (c[0] < xMin) {
                xMin = c[0];
            }

            if (c[0] > xMax) {
                xMax = c[0];
            }

            if (c[1] < yMin) {
                yMin = c[1];
            }

            if (c[1] > yMax) {
                yMax = c[1];
            }
        });

        return BoundingBox.fromPoints([
            [xMin, yMin],
            [xMax, yMax]
        ]);
    }

    static fromArray([[xMin, yMin], [xMax, yMax]]) {
        return new BoundingBox(xMin, xMax, yMin, yMax);
    }

    constructor(xMin, xMax, yMin, yMax) {
        this._xMin = xMin;
        this._xMax = xMax;
        this._yMin = yMin;
        this._yMax = yMax;
    }

    get xMin() {
        return this._xMin;
    }

    get xMax() {
        return this._xMax;
    }

    get yMin() {
        return this._yMin;
    }

    get yMax() {
        return this._yMax;
    }

    get dX() {
        return this._xMax - this._xMin;
    }

    get dY() {
        return this._yMax - this._yMin;
    }

    get geoJson() {
        return {
            type: 'Feature',
            properties: {},
            geometry: {
                coordinates: [[
                    [this.xMin, this.yMin],
                    [this.xMin, this.yMax],
                    [this.xMax, this.yMax],
                    [this.xMax, this.yMin],
                    [this.xMin, this.yMin],
                ]],
                type: 'Polygon'
            }
        }
    }

    toArray = () => ([
        [this._xMin, this._yMin],
        [this._xMax, this._yMax]
    ]);

    getBoundsLatLng = () => {
        return [
            [this.yMin, this.xMin],
            [this.yMax, this.xMax]
        ];
    };

    sameAs = (obj) => {
        return isEqual(obj.toArray(), this.toArray())
    }
}

export default BoundingBox;
