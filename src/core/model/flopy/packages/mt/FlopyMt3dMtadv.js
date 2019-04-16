import FlopyMt3dPackage from './FlopyMt3dPackage';

class FlopyMt3dMtadv extends FlopyMt3dPackage {

    _mixelm = 3;
    _percel = 0.75;
    _mxpart = 800000;
    _nadvfd = 1;
    _itrack = 3;
    _wd = 0.5;
    _dceps = 1e-5;
    _nplane = 2;
    _npl = 10;
    _nph = 40;
    _npmin = 5;
    _npmax = 80;
    _nlsink = 0;
    _npsink = 15;
    _dchmoc = 0.0001;
    _extension = 'adv';
    _unitnumber = null;
    _filenames = null;

    get mixelm() {
        return this._mixelm;
    }

    set mixelm(value) {
        this._mixelm = value;
    }

    get percel() {
        return this._percel;
    }

    set percel(value) {
        this._percel = value;
    }

    get mxpart() {
        return this._mxpart;
    }

    set mxpart(value) {
        this._mxpart = value;
    }

    get nadvfd() {
        return this._nadvfd;
    }

    set nadvfd(value) {
        this._nadvfd = value;
    }

    get itrack() {
        return this._itrack;
    }

    set itrack(value) {
        this._itrack = value;
    }

    get wd() {
        return this._wd;
    }

    set wd(value) {
        this._wd = value;
    }

    get dceps() {
        return this._dceps;
    }

    set dceps(value) {
        this._dceps = value;
    }

    get nplane() {
        return this._nplane;
    }

    set nplane(value) {
        this._nplane = value;
    }

    get npl() {
        return this._npl;
    }

    set npl(value) {
        this._npl = value;
    }

    get nph() {
        return this._nph;
    }

    set nph(value) {
        this._nph = value;
    }

    get npmin() {
        return this._npmin;
    }

    set npmin(value) {
        this._npmin = value;
    }

    get npmax() {
        return this._npmax;
    }

    set npmax(value) {
        this._npmax = value;
    }

    get nlsink() {
        return this._nlsink;
    }

    set nlsink(value) {
        this._nlsink = value;
    }

    get npsink() {
        return this._npsink;
    }

    set npsink(value) {
        this._npsink = value;
    }

    get dchmoc() {
        return this._dchmoc;
    }

    set dchmoc(value) {
        this._dchmoc = value;
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

export default FlopyMt3dMtadv;
