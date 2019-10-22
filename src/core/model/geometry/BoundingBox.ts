import {AllGeoJSON} from '@turf/helpers';
import {envelope} from '@turf/turf';
import {GeoJSON, Point} from 'geojson';
import {isEqual} from 'lodash';
import md5 from 'md5';
import {IBoundingBox} from './BoundingBox.type';

class BoundingBox {

    get xMin() {
        return this._props[0][0] < this._props[1][0] ? this._props[0][0] : this._props[1][0];
    }

    get xMax() {
        return this._props[0][0] > this._props[1][0] ? this._props[0][0] : this._props[1][0];
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

    public static fromPoints(points: Point[]) {
        if (points.length < 1) {
            return new BoundingBox([[13.74, 51.03], [13.75, 51.04]]);
        }

        const firstPoint = points[0];
        let [xMin, yMin] = firstPoint.coordinates;
        let [xMax, yMax] = firstPoint.coordinates;

        if (points.length === 1) {
            xMin -= .01;
            xMax += .01;
            yMin -= .01;
            yMax += .01;
            return new BoundingBox([[xMin, yMin], [xMax, yMax]]);
        }

        points.forEach((p: Point) => {
            const [x, y] = p.coordinates;
            if (x < xMin) {
                xMin = x;
            }

            if (x > xMax) {
                xMax = x;
            }

            if (y < yMin) {
                yMin = y;
            }

            if (y > yMax) {
                yMax = y;
            }
        });

        return new BoundingBox([[xMin, yMin], [xMax, yMax]]);

    }

    public static fromObject(obj: IBoundingBox) {
        return new BoundingBox(obj);
    }

    private readonly _props: IBoundingBox;

    constructor([[xMin, yMin], [xMax, yMax]]: IBoundingBox) {
        this._props = [[xMin, yMin], [xMax, yMax]];
    }

    public hash = () => (md5(JSON.stringify(this.geoJson)));

    public isValid = () => !(!this.xMin || !this.xMax || !this.yMin || !this.yMax);

    public toObject = (): IBoundingBox => this._props;

    public getBoundsLatLng = (): Array<[number, number]> => {
        return [
            [this.yMin, this.xMin],
            [this.yMax, this.xMax]
        ];
    };

    public sameAs = (obj: BoundingBox) => {
        return isEqual(obj.toObject(), this.toObject());
    };
}

export default BoundingBox;
