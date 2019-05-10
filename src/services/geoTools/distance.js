import {distance} from '@turf/turf';
import {BoundingBox, Geometry} from '../../core/model/modflow';

export const dxGeometry = (geometry) => {

    if (!(geometry instanceof Geometry)) {
        throw new Error('Expecting instance of Geometry');
    }

    const boundingBox = BoundingBox.fromGeoJson(geometry.toGeoJSON());

    const dxPoint1 = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [boundingBox.xMin, boundingBox.yMin]
        }
    };

    const dxPoint2 = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [boundingBox.xMax, boundingBox.yMin]
        }
    };

    const options = {units: 'kilometers'};

    return Math.round(distance(dxPoint1, dxPoint2, options) * 1000);
};

export const dyGeometry = (geometry) => {

    if (!(geometry instanceof Geometry)) {
        throw new Error('Expecting instance of Geometry');
    }

    const boundingBox = BoundingBox.fromGeoJson(geometry.toGeoJSON());

    const dyPoint1 = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [boundingBox.xMin, boundingBox.yMin]
        }
    };

    const dyPoint2 = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [boundingBox.xMin, boundingBox.yMax]
        }
    };

    const options = {units: 'kilometers'};
    return Math.round(distance(dyPoint1, dyPoint2, options) * 1000);
};


export const dxCell = (boundingBox, gridSize) => {
    const point1 = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [boundingBox.xMin, boundingBox.yMin]
        }
    };

    const point2 = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [boundingBox.xMin + boundingBox.dX / gridSize.nX, boundingBox.yMin]
        }
    };

    const options = {units: 'kilometers'};

    return distance(point1, point2, options)
};

export const dyCell = (boundingBox, gridSize) => {
    const point1 = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [boundingBox.xMin, boundingBox.yMin]
        }
    };

    const point2 = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [boundingBox.xMin, boundingBox.yMin + boundingBox.dY / gridSize.nY]
        }
    };

    const options = {units: 'kilometers'};

    return distance(point1, point2, options)
};

export const delc = (boundingBox, gridSize) => {
    const point1 = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [boundingBox.xMin, boundingBox.yMin]
        }
    };

    const point2 = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [boundingBox.xMin, boundingBox.yMax]
        }
    };

    const options = {units: 'kilometers'};

    return Number((distance(point1, point2, options) / gridSize.nY * 1000).toFixed(3));
};


export const delr = (boundingBox, gridSize) => {
    const point1 = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [boundingBox.xMin, boundingBox.yMin]
        }
    };

    const point2 = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [boundingBox.xMax, boundingBox.yMin]
        }
    };

    const options = {units: 'kilometers'};

    return Number((distance(point1, point2, options) / gridSize.nX * 1000).toFixed(3));
};

export const distanceBetweenCoordinates = (lat1, lon1, lat2, lon2) => {
    const p = Math.PI / 180;
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p) / 2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;

    return 12742000 * Math.asin(Math.sqrt(a));
};