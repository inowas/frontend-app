import {AllGeoJSON} from '@turf/helpers';
import {envelope} from '@turf/turf';
import {isEqual} from 'lodash';
import md5 from 'md5';

type Point = [number, number];
type Points = Point[];

class BoundingBox {
    public static fromPoints([[xMin, yMin], [xMax, yMax]]: Points) {
        return new BoundingBox(xMin, xMax, yMin, yMax);
    }

    public static fromGeoJson(geoJson: AllGeoJSON) {
        const polygon = envelope(geoJson);

        if (!polygon.geometry) {
            throw new Error('No geometry');
        }

        const coordinates = polygon.geometry.coordinates[0];
        let [xMin, yMin] = coordinates[0];
        let [xMax, yMax] = coordinates[0];

        coordinates.forEach((c) => {
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

    public static fromArray([[xMin, yMin], [xMax, yMax]]: Points) {
        return new BoundingBox(xMin, xMax, yMin, yMax);
    }

    constructor(
        private readonly _xMin: number,
        private readonly _xMax: number,
        private readonly _yMin: number,
        private readonly _yMax: number) {
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

    public hash = () => (md5(JSON.stringify(this.geoJson)));

    get geoJson() {
        return {
            type: 'Feature',
            properties: {},
            geometry: {
                coordinates: [[
                    [this._xMin, this._yMin],
                    [this._xMin, this._yMax],
                    [this._xMax, this._yMax],
                    [this._xMax, this._yMin],
                    [this._xMin, this._yMin],
                ]],
                type: 'Polygon'
            }
        };
    }

    public isValid = () => !(!this._xMin || !this._xMax || !this._yMin || !this._yMax);

    public toArray = () => ([
        [this._xMin, this._yMin],
        [this._xMax, this._yMax]
    ]);

    get northEast() {
        return {
            lat: this.yMax,
            lon: this.xMax
        };
    }

    get southWest() {
        return {
            lat: this.yMin,
            lon: this.xMin
        };
    }

    public getBoundsLatLng = () => {
        return [
            [this._yMin, this._xMin],
            [this._yMax, this._xMax]
        ];
    };

    public sameAs = (obj: BoundingBox) => {
        return isEqual(obj.toArray(), this.toArray());
    };
}

export default BoundingBox;
