import {Array2D} from '../../../../core/model/geometry/Array2D.type';
import GridSize from '../../../../core/model/geometry/GridSize';

export default {};

test('To object', () => {
    const gridSize = GridSize.fromArray([500, 300]);

    expect(gridSize.toObject()).toEqual({
        n_x: 500,
        n_y: 300
    });
});

test('From data (2D Array)', () => {
    const data1: Array2D = [[1, 2, 3], [2, 3, 4], [3, 4, 5]];
    const data2: Array2D = [];

    expect(GridSize.fromData(data1 as Array2D).toObject()).toEqual({
        n_x: 3,
        n_y: 3
    });

    expect(() => GridSize.fromData(data2 as Array2D)).toThrow();
});
