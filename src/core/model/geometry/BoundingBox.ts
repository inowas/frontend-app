import {AllGeoJSON} from '@turf/helpers';
import {envelope} from '@turf/turf';
import {GeoJSON} from 'geojson';
import {isEqual} from 'lodash';
import md5 from 'md5';
import {IBoundingBox} from './BoundingBox.type';

class BoundingBox {

    get xMin() {
        return this._props[0][0] < this._props[1][0] ? this._props[0][0] : this._props[0][1];
    }

    get xMax() {
        return this._props[0][0] > this._props[1][0] ? this._props[0][0] : this._props[0][1];
    }

    get yMin() {
        return this._props[0][1] < this._props[1][1] ? this._props[0][1] : this._props[1][1];
    }

    get yMax() {
        return this._props[0][1] > this._props[1][1] ? this._props[0][1] : this._props[1][1];
    }

    get dX() {
        return this.xMax - this.xMin;
    }

    get dY() {
        return this.yMax - this.yMin;
    }

    get geoJson(): GeoJSON {
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
        };
    }

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

        return BoundingBox.fromObject([
            [xMin, yMin],
            [xMax, yMax]
        ]);
    }

    public static fromArray(obj: IBoundingBox) {
        return new BoundingBox(obj);
    }

    public static fromObject(obj: IBoundingBox) {
        return new BoundingBox(obj);
    }

    private readonly _props: IBoundingBox;

    constructor(props: IBoundingBox) {
        this._props = props;
    }

    public hash = () => (md5(JSON.stringify(this.geoJson)));

    public isValid = () => !(!this.xMin || !this.xMax || !this.yMin || !this.yMax);

    public toArray = (): IBoundingBox => this._props;

    public getBoundsLatLng = (): Array<[number, number]> => {
        return [
            [this.yMin, this.xMin],
            [this.yMax, this.xMax]
        ];
    };

    public sameAs = (obj: BoundingBox) => {
        return isEqual(obj.toArray(), this.toArray());
    };
}

export default BoundingBox;
