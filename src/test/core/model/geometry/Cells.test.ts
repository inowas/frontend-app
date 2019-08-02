import {booleanCrosses} from '@turf/turf';
import {BoundingBox, Geometry, GridSize} from '../../../../core/model/geometry';
import Cells from '../../../../core/model/geometry/Cells';

export default {};

test('cells works', () => {
    const cells = Cells.create([[1, 2, 3], [4, 5, 6]]);
    expect(cells.toArray()).toEqual([[1, 2, 3], [4, 5, 6]]);
});

test('turf boolean crosses', () => {
    const linestring = Geometry.fromGeoJson({
        type: 'LineString',
        coordinates: [[0, 0], [10, 10]]
    });

    const polygon = Geometry.fromGeoJson({
        type: 'Polygon',
        coordinates: [[[2, 8], [8, 8], [8, 2], [2, 2], [2, 8]]]
    });

    expect(booleanCrosses(linestring.toObject(), polygon.toObject())).toBeTruthy();
});

test('Create cells from geometry', () => {
    const geometry = Geometry.fromGeoJson({
        type: 'LineString',
        coordinates: [[0, 0], [5, 9]]
    });

    const boundingBox = new BoundingBox([[0, 0], [10, 10]]);
    const gridSize = new GridSize(10, 10);

    const cells = Cells.fromGeometry(geometry, boundingBox, gridSize);

    // tslint:disable-next-line:max-line-length
    expect(cells.cells).toEqual([[4, 0, 0], [5, 0, 0], [4, 1, 0], [5, 1, 0], [3, 2, 0], [4, 2, 0], [3, 3, 0], [2, 4, 0], [3, 4, 0], [2, 5, 0], [1, 6, 0], [2, 6, 0], [1, 7, 0], [0, 8, 0], [1, 8, 0], [0, 9, 0]]);
    expect(cells.cells.length).toBe(16);
});
