import AffectedCells from 'core/model/modflow/boundaries/AffectedCells';

test('Create AffectedCells fromLayersAndCells', () => {
    const emptyAffectedCells = AffectedCells.fromLayersAndCells();
    expect(emptyAffectedCells).toBeInstanceOf(AffectedCells);
    expect(emptyAffectedCells.cells).toEqual([]);

    const affectedCells = AffectedCells.fromLayersAndCells([0, 1], [[2, 3], [3, 4]]);
    expect(affectedCells).toBeInstanceOf(AffectedCells);
    expect(affectedCells.cells).toEqual([
        [2, 3, 0],
        [3, 4, 0],
        [2, 3, 1],
        [3, 4, 1]
    ]);
    expect(affectedCells.toObject).toEqual([
        [2, 3, 0],
        [3, 4, 0],
        [2, 3, 1],
        [3, 4, 1]
    ]);
});

test('Create AffectedCells fromObject', () => {
    const obj = [[2, 3, 0], [3, 4, 0], [2, 3, 1], [3, 4, 1]];
    const affectedCells = AffectedCells.fromObject(obj);
    expect(affectedCells).toBeInstanceOf(AffectedCells);
    expect(affectedCells.cells).toEqual(obj);
    expect(affectedCells.toObject).toEqual(obj);
});

test('AffectedCells addCell', () => {
    const affectedCells = AffectedCells.fromLayersAndCells([0, 1], [[2, 3], [3, 4]]);
    expect(affectedCells).toBeInstanceOf(AffectedCells);
    expect(affectedCells.cells).toEqual([
        [2, 3, 0],
        [3, 4, 0],
        [2, 3, 1],
        [3, 4, 1]
    ]);

    affectedCells.addCell([4, 5, 1]);
    expect(affectedCells.cells).toEqual([
        [2, 3, 0],
        [3, 4, 0],
        [2, 3, 1],
        [3, 4, 1],
        [4, 5, 1]
    ]);
});

test('AffectedCells addCell throws error', () => {
    const affectedCells = AffectedCells.fromLayersAndCells();
    expect(affectedCells).toBeInstanceOf(AffectedCells);
    expect(() => affectedCells.addCell([])).toThrow();
});
