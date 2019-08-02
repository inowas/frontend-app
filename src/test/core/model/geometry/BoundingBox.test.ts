import BoundingBox from '../../../../core/model/geometry/BoundingBox';

test('bounding box works', () => {
    const box = new BoundingBox([[-1, -2], [3, 4]]);
    expect(box.isValid()).toBe(true);
    expect(box.xMin).toEqual(-1);
    expect(box.xMax).toEqual(3);
    expect(box.yMin).toEqual(-2);
    expect(box.yMax).toEqual(4);
    expect(box.dX).toEqual(4);
    expect(box.dY).toEqual(6);
    expect(box.northEast).toEqual({lat: 4, lon: 3});
    expect(box.southWest).toEqual({lat: -2, lon: -1});
    expect(box.getBoundsLatLng()).toEqual([[-2, -1], [4, 3]]);
});
