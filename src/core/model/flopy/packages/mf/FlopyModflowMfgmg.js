import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfgmg extends FlopyModflowPackage {

    _mxiter = 50;
    _iiter = 30;
    _iadamp = 0;
    _hclose = 1e-05;
    _rclose = 1e-05;
    _relax = 1.0;
    _ioutgmg = 0;
    _iunitmhc = null;
    _ism = 0;
    _isc = 0;
    _damp = 1.0;
    _dup = 0.75;
    _dlow = 0.01;
    _chglimit = 1.0;
    _extension = 'gmg';
    _unitnumber = null;
    _filenames = null;


    get mxiter() {
        return this._mxiter;
    }

    set mxiter(value) {
        this._mxiter = value;
    }

    get iiter() {
        return this._iiter;
    }

    set iiter(value) {
        this._iiter = value;
    }

    get iadamp() {
        return this._iadamp;
    }

    set iadamp(value) {
        this._iadamp = value;
    }

    get hclose() {
        return this._hclose;
    }

    set hclose(value) {
        this._hclose = value;
    }

    get rclose() {
        return this._rclose;
    }

    set rclose(value) {
        this._rclose = value;
    }

    get relax() {
        return this._relax;
    }

    set relax(value) {
        this._relax = value;
    }

    get ioutgmg() {
        return this._ioutgmg;
    }

    set ioutgmg(value) {
        this._ioutgmg = value;
    }

    get iunitmhc() {
        return this._iunitmhc;
    }

    set iunitmhc(value) {
        this._iunitmhc = value;
    }

    get ism() {
        return this._ism;
    }

    set ism(value) {
        this._ism = value;
    }

    get isc() {
        return this._isc;
    }

    set isc(value) {
        this._isc = value;
    }

    get damp() {
        return this._damp;
    }

    set damp(value) {
        this._damp = value;
    }

    get dup() {
        return this._dup;
    }

    set dup(value) {
        this._dup = value;
    }

    get dlow() {
        return this._dlow;
    }

    set dlow(value) {
        this._dlow = value;
    }

    get chglimit() {
        return this._chglimit;
    }

    set chglimit(value) {
        this._chglimit = value;
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
