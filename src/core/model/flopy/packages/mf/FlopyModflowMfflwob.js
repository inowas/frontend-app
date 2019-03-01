import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfflwob extends FlopyModflowPackage {

    _nqfb = 0;
    _nqcfb = 0;
    _nqtfb = 0;
    _iufbobsv = 0;
    _tomultfb = 1.0;
    _nqobfb = null;
    _nqclfb = null;
    _obsnam = null;
    _irefsp = null;
    _toffset = null;
    _flwobs = null;
    _layer = null;
    _row = null;
    _column = null;
    _factor = null;
    _flowtype = null;
    _extension = null;
    _unitnumber = null;


    get nqfb() {
        return this._nqfb;
    }

    set nqfb(value) {
        this._nqfb = value;
    }

    get nqcfb() {
        return this._nqcfb;
    }

    set nqcfb(value) {
        this._nqcfb = value;
    }

    get nqtfb() {
        return this._nqtfb;
    }

    set nqtfb(value) {
        this._nqtfb = value;
    }

    get iufbobsv() {
        return this._iufbobsv;
    }

    set iufbobsv(value) {
        this._iufbobsv = value;
    }

    get tomultfb() {
        return this._tomultfb;
    }

    set tomultfb(value) {
        this._tomultfb = value;
    }

    get nqobfb() {
        return this._nqobfb;
    }

    set nqobfb(value) {
        this._nqobfb = value;
    }

    get nqclfb() {
        return this._nqclfb;
    }

    set nqclfb(value) {
        this._nqclfb = value;
    }

    get obsnam() {
        return this._obsnam;
    }

    set obsnam(value) {
        this._obsnam = value;
    }

    get irefsp() {
        return this._irefsp;
    }

    set irefsp(value) {
        this._irefsp = value;
    }

    get toffset() {
        return this._toffset;
    }

    set toffset(value) {
        this._toffset = value;
    }

    get flwobs() {
        return this._flwobs;
    }

    set flwobs(value) {
        this._flwobs = value;
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

    get factor() {
        return this._factor;
    }

    set factor(value) {
        this._factor = value;
    }

    get flowtype() {
        return this._flowtype;
    }

    set flowtype(value) {
        this._flowtype = value;
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
}
