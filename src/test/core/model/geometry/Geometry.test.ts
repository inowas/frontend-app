import Geometry from '../../../../core/model/geometry/Geometry';

test('geometry works for points', () => {
    const point = Geometry.fromGeoJson({
        type: 'Point',
        coordinates: [-104.99404, 39.75621]
    });

    expect(point).toBeInstanceOf(Geometry);
    expect(point.type).toBe('Point');
    expect(point.coordinates).toEqual([-104.99404, 39.75621]);
    expect(point.coordinatesLatLng).toEqual([39.75621, -104.99404]);
});

test('geometry works for lineStrings', () => {
    const geometry = Geometry.fromGeoJson({
        type: 'LineString',
        coordinates: [[0, -4], [3, -4], [11, 0], [11, 4], [15, 2], [19, 2], [19, -2]]
    });

    expect(geometry).toBeInstanceOf(Geometry);
    expect(geometry.type).toBe('LineString');
    expect(geometry.coordinates).toEqual([[0, -4], [3, -4], [11, 0], [11, 4], [15, 2], [19, 2], [19, -2]]);
});

test('geometry fromObject/toObject', () => {
    const geometry = Geometry.fromGeoJson({
        type: 'LineString',
        coordinates: [[0, -4], [3, -4], [11, 0], [11, 4], [15, 2], [19, 2], [19, -2]]
    });

    expect(geometry.toObject()).toEqual(Geometry.fromObject(geometry.toObject()).toObject());
});
