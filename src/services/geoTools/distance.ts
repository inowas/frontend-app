import {BoundingBox, Geometry} from '../../core/model/modflow';
import {Coord} from '@turf/helpers';
import {distance} from '@turf/turf';
import GridSize from '../../core/model/geometry/GridSize';

export const dxGeometry = (geometry: Geometry) => {
    const boundingBox = BoundingBox.fromGeoJson(geometry.toGeoJSON());

    const dxPoint1: Coord = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [boundingBox.xMin, boundingBox.yMin]
        }
    };

    const dxPoint2: Coord = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [boundingBox.xMax, boundingBox.yMin]
        }
    };

    const options: {units: 'kilometers'} = {units: 'kilometers'};

    return Math.round(distance(dxPoint1, dxPoint2, options) * 1000);
};

export const dyGeometry = (geometry: Geometry) => {
    const boundingBox = BoundingBox.fromGeoJson(geometry.toGeoJSON());

    const dyPoint1: Coord = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [boundingBox.xMin, boundingBox.yMin]
        }
    };

    const dyPoint2: Coord = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [boundingBox.xMin, boundingBox.yMax]
        }
    };

    const options: {units: 'kilometers'} = {units: 'kilometers'};
    return Math.round(distance(dyPoint1, dyPoint2, options) * 1000);
};

export const dxCell = (boundingBox: BoundingBox, gridSize: GridSize) => {
    const point1: Coord = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [boundingBox.xMin, boundingBox.yMin]
        }
    };

    const point2: Coord = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [boundingBox.xMin + boundingBox.dX / gridSize.nX, boundingBox.yMin]
        }
    };

    const options: {units: 'kilometers'} = {units: 'kilometers'};

    return distance(point1, point2, options);
};

export const dyCell = (boundingBox: BoundingBox, gridSize: GridSize) => {
    const point1: Coord = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [boundingBox.xMin, boundingBox.yMin]
        }
    };

    const point2: Coord = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [boundingBox.xMin, boundingBox.yMin + boundingBox.dY / gridSize.nY]
        }
    };

    const options: {units: 'kilometers'} = {units: 'kilometers'};

    return distance(point1, point2, options);
};

export const delc = (boundingBox: BoundingBox, gridSize: GridSize) => {
    const point1: Coord = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [boundingBox.xMin, boundingBox.yMin]
        }
    };

    const point2: Coord = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [boundingBox.xMin, boundingBox.yMax]
        }
    };

    const options: {units: 'kilometers'} = {units: 'kilometers'};

    return Number((distance(point1, point2, options) / gridSize.nY * 1000).toFixed(3));
};

export const delr = (boundingBox: BoundingBox, gridSize: GridSize) => {
    const point1: Coord = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [boundingBox.xMin, boundingBox.yMin]
        }
    };

    const point2: Coord = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [boundingBox.xMax, boundingBox.yMin]
        }
    };

    const options: {units: 'kilometers'} = {units: 'kilometers'};

    return Number((distance(point1, point2, options) / gridSize.nX * 1000).toFixed(3));
};

export const distanceBetweenCoordinates = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const p = Math.PI / 180;
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p) / 2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;

    return 12742000 * Math.asin(Math.sqrt(a));
};
