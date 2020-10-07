import {LineString, MultiPolygon, Point, Polygon} from 'geojson';
import {Geometry} from './index';

export type GeoJson = Point | LineString | Polygon | MultiPolygon;
export type IGeometry = GeoJson;

export interface IRotationProperties {
    geometry: Geometry;
    angle: number;
}
