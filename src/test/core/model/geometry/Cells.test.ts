import Cells from '../../../../core/model/geometry/Cells';

export default {};

test('cells works', () => {
    const cells = Cells.create([[1, 2, 3], [4, 5, 6]]);
    expect(cells.toArray()).toEqual([[1, 2, 3], [4, 5, 6]]);
});
