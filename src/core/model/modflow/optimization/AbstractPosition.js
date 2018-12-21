class AbstractPosition {
    _lay = {
        min: 0,
        max: 0,
        result: null
    };
    _row = {
        min: 0,
        max: 0,
        result: null
    };
    _col = {
        min: 0,
        max: 0,
        result: null
    };

    static fromObject(obj) {
        const position = new AbstractPosition();
        position.lay = obj.lay;
        position.row = obj.row;
        position.col = obj.col;
        return position;
    }

    get lay() {
        return this._lay;
    }

    set lay(value) {
        this._lay = value ? value : {min: 0, max: 0, result: null};
    }

    get row() {
        return this._row;
    }

    set row(value) {
        this._row = value ? value : {min: 0, max: 0, result: null};
    }

    get col() {
        return this._col;
    }

    set col(value) {
        this._col = value ? value : {min: 0, max: 0, result: null};
    }

    toObject() {
        return ({
            'lay': this.lay,
            'row': this.row,
            'col': this.col
        });
    }
}

export default AbstractPosition;