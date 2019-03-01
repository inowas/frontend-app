import FlopyModflowPackage from './FlopyModflowPackage';

/*
https://modflowpy.github.io/flopydoc/mfriv.html

stress_period_data =
{0: [
    [lay, row, col, stage, cond, rbot],
    [lay, row, col, stage, cond, rbot],
    [lay, row, col, stage, cond, rbot]
    ],
1:  [
    [lay, row, col, stage, cond, rbot],
    [lay, row, col, stage, cond, rbot],
    [lay, row, col, stage, cond, rbot]
    ], ...
kper:
    [
    [lay, row, col, stage, cond, rbot],
    [lay, row, col, stage, cond, rbot],
    [lay, row, col, stage, cond, rbot]
    ]
}
 */

export default class FlopyModflowMfriv extends FlopyModflowPackage {

    _ipakcb = null;
    _stress_period_data = null;
    _dtype = null;
    _extension = 'riv';
    _options = null;
    _unitnumber = null;
    _filenames = null;

    get ipakcb() {
        return this._ipakcb;
    }

    set ipakcb(value) {
        this._ipakcb = value;
    }

    get stress_period_data() {
        return this._stress_period_data;
    }

    set stress_period_data(value) {
        this._stress_period_data = value;
    }

    get dtype() {
        return this._dtype;
    }

    set dtype(value) {
        this._dtype = value;
    }

    get extension() {
        return this._extension;
    }

    set extension(value) {
        this._extension = value;
    }

    get options() {
        return this._options;
    }

    set options(value) {
        this._options = value;
    }

    get unitnumber() {
        return this._unitnumber;
    }

    set unitnumber(value) {
        this._unitnumber = value;
    }

    get filenames() {
        return this._filenames;
    }

    set filenames(value) {
        this._filenames = value;
    }
}