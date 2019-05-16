import Geometry from '../../../../core/model/geometry/Geometry';

export default {};

test('geometry works for points', () => {
    const point = Geometry.fromGeoJson({
        type: 'Point',
        coordinates: [-104.99404, 39.75621]
    });

    expect(point.type).toBe('Point');
    expect(point.coordinates).toEqual([-104.99404, 39.75621]);
    expect(point.coordinatesLatLng).toEqual([39.75621, -104.99404]);
});
