import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfdis extends FlopyModflowPackage {

    _nlay = 1;
    _nrow = 2;
    _ncol = 2;
    _nper = 1;
    _delr = 1.0;
    _delc = 1.0;
    _laycbd = 0;
    _top = 1;
    _botm = 0;
    _perlen = 1;
    _nstp = 1;
    _tsmult = 1;
    _steady = true;
    _itmuni = 4;
    _lenuni = 2;
    _extension = 'dis';
    _unitnumber = null;
    _filenames = null;
    _xul = null;
    _yul = null;
    _rotation = 0.0;
    _proj4_str = null;
    _start_datetime = null;

    get nlay() {
        return this._nlay;
    }

    set nlay(value) {
        this._nlay = value;
    }

    get nrow() {
        return this._nrow;
    }

    set nrow(value) {
        this._nrow = value;
    }

    get ncol() {
        return this._ncol;
    }

    set ncol(value) {
        this._ncol = value;
    }

    get nper() {
        return this._nper;
    }

    set nper(value) {
        this._nper = value;
    }

    get delr() {
        return this._delr;
    }

    set delr(value) {
        this._delr = value;
    }

    get delc() {
        return this._delc;
    }

    set delc(value) {
        this._delc = value;
    }

    get laycbd() {
        return this._laycbd;
    }

    set laycbd(value) {
        this._laycbd = value;
    }

    get top() {
        return this._top;
    }

    set top(value) {
        this._top = value;
    }

    get botm() {
        return this._botm;
    }

    set botm(value) {
        this._botm = value;
    }

    get perlen() {
        return this._perlen;
    }

    set perlen(value) {
        this._perlen = value;
    }

    get nstp() {
        return this._nstp;
    }

    set nstp(value) {
        this._nstp = value;
    }

    get tsmult() {
        return this._tsmult;
    }

    set tsmult(value) {
        this._tsmult = value;
    }

    get steady() {
        return this._steady;
    }

    set steady(value) {
        this._steady = value;
    }

    get itmuni() {
        return this._itmuni;
    }

    set itmuni(value) {
        this._itmuni = value;
    }

    get lenuni() {
        return this._lenuni;
    }

    set lenuni(value) {
        this._lenuni = value;
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

    get xul() {
        return this._xul;
    }

    set xul(value) {
        this._xul = value;
    }

    get yul() {
        return this._yul;
    }

    set yul(value) {
        this._yul = value;
    }

    get rotation() {
        return this._rotation;
    }

    set rotation(value) {
        this._rotation = value;
    }

    get proj4_str() {
        return this._proj4_str;
    }

    set proj4_str(value) {
        this._proj4_str = value;
    }

    get start_datetime() {
        return this._start_datetime;
    }

    set start_datetime(value) {
        this._start_datetime = value;
    }
}
