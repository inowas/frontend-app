class Mt3dStressPeriodDataSet {

    // SET stress_period_data
    // ssm_data[0] = [
    // [4, 4, 4, 1.0, itype['GHB'], 1.0, 100.0)]

    _layer;
    _row;
    _column;
    _concentrations;

    /* String with BoundaryType or Integer */
    _itype;

    static fromArray = (arr) => {
        return new Mt3dStressPeriodDataSet(arr);
    };

    constructor(arr) {
        if (!Array.isArray(arr)) {
            throw new Error('Dataset must be an array');
        }

        if (arr.length < 5) {
            throw new Error('Dataset should have minimum length of 5');
        }

        this.layer = arr[0];
        this.row = arr[1];
        this.column = arr[2];
        this.concentrations = [arr[3]];
        this.itype = arr[4];

        if (arr.length > 5) {
            const concentrations = [];
            arr.forEach((e, i) => {
                if (i > 4) {
                    concentrations.push(e);
                }
            });

            this.concentrations = concentrations;
        }
    }

    get layer() {
        return this._layer;
    }

    set layer(value) {
        this._layer = value;
    }

    get row() {
        return this._row;
    }

    set row(value) {
        this._row = value;
    }

    get column() {
        return this._column;
    }

    set column(value) {
        this._column = value;
    }

    get concentrations() {
        return this._concentrations;
    }

    set concentrations(value) {
        this._concentrations = value;
    }

    get itype() {
        return this._itype;
    }

    set itype(value) {
        this._itype = value;
    }

    get toArray() {
        const arr = [this.layer, this.row, this.column, this.concentrations[0], this.itype];
        if (this.concentrations.length > 1) {
            this.concentrations.forEach(c => arr.push(c));
        }
        return arr;
    }
}

export default Mt3dStressPeriodDataSet;
