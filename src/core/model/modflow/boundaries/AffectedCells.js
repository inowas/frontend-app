class AffectedCells {
    // [[int:x, int:y, int:z]]
    _cells = [];

    static fromObject(obj) {
        const affectedCells = new AffectedCells();
        obj.forEach(c => affectedCells.addCell(c));
        return affectedCells;
    }

    static fromLayersAndCells(layers, cells) {
        const affectedCells = new AffectedCells();
        if (!Array.isArray(layers) || !Array.isArray(cells)) {
            return affectedCells;
        }

        layers.forEach(l => {
            cells.forEach(c => {
                affectedCells.addCell([c[0], c[1], l]);
            });
        });

        return affectedCells;
    }

    addCell(cell) {
        if (Array.isArray(cell) && cell.length === 3) {
            this._cells.push(cell);
            return;
        }

        throw new Error('Unexpected value for Cell.');
    }

    get cells() {
        return this._cells;
    }

    get toObject() {
        return this._cells;
    }
}

export default AffectedCells;
