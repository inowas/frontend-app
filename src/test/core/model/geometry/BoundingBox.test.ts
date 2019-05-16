import BoundingBox from '../../../../core/model/geometry/BoundingBox';

export default {};

test('bounding box works', () => {
    const box = BoundingBox.fromPoints([[1, 1], [3, 3]]);

    expect(box.isValid()).toBe(true);
    expect(box.dX).toEqual(2);
    expect(box.dY).toEqual(2);
    expect(box.northEast).toEqual({lat: 3, lon: 3});
    expect(box.southWest).toEqual({lat: 1, lon: 1});
    expect(box.getBoundsLatLng()).toEqual([[1, 1], [3, 3]]);
});
