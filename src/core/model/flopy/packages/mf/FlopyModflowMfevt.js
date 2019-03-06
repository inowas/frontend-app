import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfevt extends FlopyModflowPackage {

    _nevtop = 3;
    _ipakcb = null;
    _surf = 0.0;
    _evtr = 0.001;
    _exdp = 1.0;
    _ievt = 1;
    _extension = 'evt';
    _unitnumber = null;
    _filenames = null;
    _external = true;

    get nevtop() {
        return this._nevtop;
    }

    set nevtop(value) {
        this._nevtop = value;
    }

    get ipakcb() {
        return this._ipakcb;
    }

    set ipakcb(value) {
        this._ipakcb = value;
    }

    get surf() {
        return this._surf;
    }

    set surf(value) {
        this._surf = value;
    }

    get evtr() {
        return this._evtr;
    }

    set evtr(value) {
        this._evtr = value;
    }

    get exdp() {
        return this._exdp;
    }

    set exdp(value) {
        this._exdp = value;
    }

    get ievt() {
        return this._ievt;
    }

    set ievt(value) {
        this._ievt = value;
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

    get external() {
        return this._external;
    }

    set external(value) {
        this._external = value;
    }
}
