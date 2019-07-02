import FlopySeawatPackage from './FlopySeawatPackage';

class FlopySeawatSwtvdf extends FlopySeawatPackage {

    _mtdnconc = 1;
    _mfnadvfd = 1;
    _nswtcpl = 1;
    _iwtable = 1;
    _densemin = 1.0;
    _densemax = 1.025;
    _dnscrit = 0.01;
    _denseref = 1.0;
    _denseslp = 0.025;
    _drhodc = 0;
    _crhoref = 0;
    _firstdt = 0.001;
    _indense = 1;
    _dense = 1.0;
    _nsrhoeos = 1;
    _drhodprhd = 0.00446;
    _prhdref = 0.0;
    _extension = 'vdf';
    _unitnumber = null;
    _filenames = null;


    get mtdnconc() {
        return this._mtdnconc;
    }

    set mtdnconc(value) {
        value = parseInt(value);
        this._mtdnconc = value;
    }

    get mfnadvfd() {
        return this._mfnadvfd;
    }

    set mfnadvfd(value) {
        value = parseInt(value);
        this._mfnadvfd = value;
    }

    get nswtcpl() {
        return this._nswtcpl;
    }

    set nswtcpl(value) {
        value = parseInt(value);
        this._nswtcpl = value;
    }

    get iwtable() {
        return this._iwtable;
    }

    set iwtable(value) {
        value = parseInt(value);
        this._iwtable = value;
    }

    get densemin() {
        return this._densemin;
    }

    set densemin(value) {
        value = parseFloat(value);
        this._densemin = value;
    }

    get densemax() {
        return this._densemax;
    }

    set densemax(value) {
        value = parseFloat(value);
        this._densemax = value;
    }

    get dnscrit() {
        return this._dnscrit;
    }

    set dnscrit(value) {
        value = parseFloat(value);
        this._dnscrit = value;
    }

    get denseref() {
        return this._denseref;
    }

    set denseref(value) {
        value = parseFloat(value);
        this._denseref = value;
    }

    get denseslp() {
        return this._denseslp;
    }

    set denseslp(value) {
        value = parseFloat(value);
        this._denseslp = value;
    }

    get drhodc() {
        return this._drhodc;
    }

    set drhodc(value) {
        value = parseFloat(value);
        this._drhodc = value;
    }

    get crhoref() {
        return this._crhoref;
    }

    set crhoref(value) {
        value = parseFloat(value);
        this._crhoref = value;
    }

    get firstdt() {
        return this._firstdt;
    }

    set firstdt(value) {
        value = parseFloat(value);
        this._firstdt = value;
    }

    get indense() {
        return this._indense;
    }

    set indense(value) {
        value = parseInt(value);
        this._indense = value;
    }

    get dense() {
        return this._dense;
    }

    set dense(value) {
        value = parseFloat(value);
        this._dense = value;
    }

    get nsrhoeos() {
        return this._nsrhoeos;
    }

    set nsrhoeos(value) {
        value = parseInt(value);
        this._nsrhoeos = value;
    }

    get drhodprhd() {
        return this._drhodprhd;
    }

    set drhodprhd(value) {
        value = parseFloat(value);
        this._drhodprhd = value;
    }

    get prhdref() {
        return this._prhdref;
    }

    set prhdref(value) {
        value = parseFloat(value);
        this._prhdref = value;
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

export default FlopySeawatSwtvdf;
