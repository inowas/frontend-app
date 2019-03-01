import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMflnmw1 extends FlopyModflowPackage {

    _mxmnw = 0;
    _ipakcb = null;
    _iwelpt = 0;
    _nomoiter = 0;
    _kspref = 1;
    _wel1_bynode_qsum = null;
    _losstype = 'skin';
    _stress_period_data = null;
    _dtype = null;
    _mnwname = null;
    _extension = 'mnw1';
    _unitnumber = null;
    _filenames = null;

    get mxmnw() {
        return this._mxmnw;
    }

    set mxmnw(value) {
        this._mxmnw = value;
    }

    get ipakcb() {
        return this._ipakcb;
    }

    set ipakcb(value) {
        this._ipakcb = value;
    }

    get iwelpt() {
        return this._iwelpt;
    }

    set iwelpt(value) {
        this._iwelpt = value;
    }

    get nomoiter() {
        return this._nomoiter;
    }

    set nomoiter(value) {
        this._nomoiter = value;
    }

    get kspref() {
        return this._kspref;
    }

    set kspref(value) {
        this._kspref = value;
    }

    get wel1_bynode_qsum() {
        return this._wel1_bynode_qsum;
    }

    set wel1_bynode_qsum(value) {
        this._wel1_bynode_qsum = value;
    }

    get losstype() {
        return this._losstype;
    }

    set losstype(value) {
        this._losstype = value;
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

    get mnwname() {
        return this._mnwname;
    }

    set mnwname(value) {
        this._mnwname = value;
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
