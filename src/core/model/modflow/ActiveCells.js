import {floor, isEqual} from 'lodash';
import {BoundingBox, GridSize} from './index';

class ActiveCells {

    _cells = [];

    static create(cells = []) {
        return new ActiveCells(cells);
    }

    static fromArray(cells) {
        return new ActiveCells(cells);
    }

    constructor(cells) {
        this._cells = cells;
    }

    toggle = ([x, y], boundingBox, gridSize) => {

        if (!(boundingBox instanceof BoundingBox)) {
            throw new Error('Geometry needs to be instance of BoundingBox');
        }

        if (!(gridSize instanceof GridSize)) {
            throw new Error('GridSize needs to be instance of GridSize');
        }

        const dx = boundingBox.dX / gridSize.nX;
        const dy = boundingBox.dY / gridSize.nY;

        const clickedCell = [
            floor((x - boundingBox.xMin) / dx),
            floor(gridSize.nY - (y - boundingBox.yMin) / dy)
        ];

        const cells = [];
        let removed = false;
        this._cells.forEach(ac => {
            if ((ac[0] === clickedCell[0] && ac[1] === clickedCell[1])) {
                removed = true;
                return;
            }
            cells.push(ac);
        });
        if (!removed) {
            cells.push(clickedCell);
        }

        this._cells = cells;
        return this;
    };

    addCell = (cell) => {
        this._cells.push(cell);
    };

    get cells() {
        return this._cells;
    }

    toArray() {
        return this._cells;
    }

    sameAs = (obj) => {
        return isEqual(obj.cells, this.cells);
    }
}

export default ActiveCells;
