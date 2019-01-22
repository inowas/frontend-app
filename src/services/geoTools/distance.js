import {distance} from '@turf/turf';

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