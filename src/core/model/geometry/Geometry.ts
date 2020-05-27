import {AllGeoJSON} from '@turf/helpers';
import {bbox} from '@turf/turf';
import * as turf from '@turf/turf';
import {cloneDeep} from 'lodash';
import md5 from 'md5';
import {GeoJson} from './Geometry.type';

class Geometry {

    public static fromGeoJson(geoJson: any) {
        if (geoJson.geometry) {
            return new Geometry(geoJson.geometry);
        }

        return new Geometry(geoJson);
    }

    public static fromObject(obj: GeoJson) {
        return new Geometry(obj);
    }

    constructor(private readonly _geometry: GeoJson) {
    }

    get type() {
        return this._geometry.type;
    }

    get coordinates() {
        return this._geometry.coordinates;
    }

    public fromType(type: string) {
        return (type.toLowerCase() === this.type.toLowerCase());
    }

    get centerOfMass() {
        return turf.centerOfMass(this._geometry as AllGeoJSON);
    }

    get coordinatesLatLng() {
        switch (this._geometry.type) {
            case 'MultiPolygon':
                return this._geometry.coordinates.map((c) => this.getLatLngFromXY(c[0]));
            case 'Polygon':
                return (this.getLatLngFromXY(this._geometry.coordinates[0]));
            case 'LineString':
                return (this.getLatLngFromXY(this._geometry.coordinates));
            default:
                return ([this._geometry.coordinates[1], this._geometry.coordinates[0]]);
        }
    }

    public toObject = () => (cloneDeep(this._geometry));

    public toGeoJSON = () => (this._geometry);

    public toGeoJSONWithRotation = (r: number, center: {lat: number, lng: number}) => {
        return turf.transformRotate(this.toGeoJSON(), -1 * r, {pivot: [center.lat, center.lng]});
    };

    public hash = () => (md5(JSON.stringify(this._geometry)));

    public getLatLngFromXY = (coordinates: number[][]) => coordinates.map((c) => [c[1], c[0]]);

    public getBounds = () => {
        const [minX, minY, maxX, maxY] = bbox(this._geometry);
        return [[minX, minY], [maxX, maxY]];
    };

    public getBoundsLatLng = (): Array<[number, number]> => {
        const [minX, minY, maxX, maxY] = bbox(this._geometry);
        return [[minY, minX], [maxY, maxX]];
    };
}

export default Geometry;
