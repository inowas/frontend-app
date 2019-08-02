import {LineString, MultiPolygon, Point, Polygon} from 'geojson';

export type GeoJson = Point | LineString | Polygon | MultiPolygon;
export type IGeometry = GeoJson;
