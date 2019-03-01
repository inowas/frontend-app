import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfstr extends FlopyModflowPackage {

    _mxacts = 0;
    _nss = 0;
    _ntrib = 0;
    _ndiv = 0;
    _icalc = 0;
    _const = 86400.0;
    _ipakcb = null;
    _istcb2 = null;
    _dtype = null;
    _stress_period_data = null;
    _segment_data = null;
    _extension = 'str';
    _unitnumber = null;
    _filenames = null;
    _options = null;

    get mxacts() {
        return this._mxacts;
    }

    set mxacts(value) {
        this._mxacts = value;
    }

    get nss() {
        return this._nss;
    }

    set nss(value) {
        this._nss = value;
    }

    get ntrib() {
        return this._ntrib;
    }

    set ntrib(value) {
        this._ntrib = value;
    }

    get ndiv() {
        return this._ndiv;
    }

    set ndiv(value) {
        this._ndiv = value;
    }

    get icalc() {
        return this._icalc;
    }

    set icalc(value) {
        this._icalc = value;
    }

    get const() {
        return this._const;
    }

    set const(value) {
        this._const = value;
    }

    get ipakcb() {
        return this._ipakcb;
    }

    set ipakcb(value) {
        this._ipakcb = value;
    }

    get istcb2() {
        return this._istcb2;
    }

    set istcb2(value) {
        this._istcb2 = value;
    }

    get dtype() {
        return this._dtype;
    }

    set dtype(value) {
        this._dtype = value;
    }

    get stress_period_data() {
        return this._stress_period_data;
    }

    set stress_period_data(value) {
        this._stress_period_data = value;
    }

    get segment_data() {
        return this._segment_data;
    }

    set segment_data(value) {
        this._segment_data = value;
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

    get options() {
        return this._options;
    }

    set options(value) {
        this._options = value;
    }
}
