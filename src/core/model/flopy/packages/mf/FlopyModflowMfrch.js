import FlopyModflowPackage from './FlopyModflowPackage';

/*
https://modflowpy.github.io/flopydoc/mfrch.html

rech = {
    0: 0.001,
    1: 0.002,
    4: 0.004
}
 */
export default class FlopyModflowMfrch extends FlopyModflowPackage {

    _nrchop = 3;
    _ipakcb = null;
    _rech = 0.001;
    _irch = 0;
    _extension = 'rch';
    _unitnumber = null;
    _filenames = null;

    get nrchop() {
        return this._nrchop;
    }

    set nrchop(value) {
        this._nrchop = value;
    }

    get ipakcb() {
        return this._ipakcb;
    }

    set ipakcb(value) {
        this._ipakcb = value;
    }

    get rech() {
        return this._rech;
    }

    set rech(value) {
        this._rech = value;
    }

    get irch() {
        return this._irch;
    }

    set irch(value) {
        this._irch = value;
    }

    get extension() {
        return this._extension;
    }

    set extension(value) {
        this._extension = value;
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
