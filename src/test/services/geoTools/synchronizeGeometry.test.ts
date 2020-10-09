import * as turf from '@turf/turf';
import {BoundingBox, Geometry, GridSize} from '../../../core/model/modflow';
import synchronizeGeometry from '../../../services/geoTools/synchronizeGeometry';

const BBOX_LENGTH = 1000;
const METER_TOLERANCE = 2;

const point = turf.point([0, 0]);
const buffer = turf.buffer(point, BBOX_LENGTH / 2, {units: 'meters'});
const geometry = Geometry.fromGeoJson(buffer);

test('Check BoundingBox', () => {
    const boundingBox = BoundingBox.fromGeoJson(geometry.toGeoJSON());

    const pointA = turf.point([boundingBox.xMin, boundingBox.yMin]);
    const pointB = turf.point([boundingBox.xMin, boundingBox.yMax]);
    const pointC = turf.point([boundingBox.xMax, boundingBox.yMin]);
    const d1 = turf.distance(pointA, pointB, {units: 'meters'});
    const d2 = turf.distance(pointA, pointC, {units: 'meters'});

    expect(Math.abs(d1 - BBOX_LENGTH)).toBeLessThan(METER_TOLERANCE);
    expect(Math.abs(d2 - BBOX_LENGTH)).toBeLessThan(METER_TOLERANCE);
});

test('BoundingBox and gridSize from cellSize', () => {
    const r1 = synchronizeGeometry(
        geometry, null, false, [250, 250], null
    );
    expect(r1.cellSize).toEqual([250, 250]);
    expect(r1.gridSize.toObject()).toEqual({n_x: 4, n_y: 5});

    const r2 = synchronizeGeometry(
        geometry, r1.boundingBox, true, null, r1.gridSize
    );
    expect(r2.cellSize).toEqual([250, 250]);
});

test('GridSize and cellSize from cellSize with fixed boundingBox', () => {
    const result = synchronizeGeometry(
        geometry, null, true, [101, 101], null
    );
    expect(result.gridSize.toObject()).toEqual({n_x: 9, n_y: 9});
});

test('CellSize from boundingBox and gridSize', () => {
    const result = synchronizeGeometry(
        geometry, null, true, null, GridSize.fromObject({n_x: 10, n_y: 10})
    );
    expect(result.cellSize).toEqual([100, 100]);
});
