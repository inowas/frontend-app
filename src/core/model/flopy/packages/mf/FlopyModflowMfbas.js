import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfbas extends FlopyModflowPackage {

    _ibound = 1;
    _strt = 1.0;
    _ifrefm = true;
    _ixsec = false;
    _ichflg = false;
    _stoper = null;
    _hnoflo = -999.99;
    _extension = 'bas';
    _unitnumber = null;
    _filenames = null;

    get ibound() {
        return this._ibound;
    }

    set ibound(value) {
        this._ibound = value;
    }

    get strt() {
        return this._strt;
    }

    set strt(value) {
        this._strt = value;
    }

    get ifrefm() {
        return this._ifrefm;
    }

    set ifrefm(value) {
        this._ifrefm = value;
    }

    get ixsec() {
        return this._ixsec;
    }

    set ixsec(value) {
        this._ixsec = value;
    }

    get ichflg() {
        return this._ichflg;
    }

    set ichflg(value) {
        this._ichflg = value;
    }

    get stoper() {
        return this._stoper;
    }

    set stoper(value) {
        this._stoper = value;
    }

    get hnoflo() {
        return this._hnoflo;
    }

    set hnoflo(value) {
        this._hnoflo = value;
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
