import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfpcgn extends FlopyModflowPackage {

    _iter_mo = 50;
    _iter_mi = 30;
    _close_r = 1e-05;
    _close_h = 1e-05;
    _relax = 1.0;
    _ifill = 0;
    _unit_pc = null;
    _unit_ts = null;
    _adamp = 0;
    _damp = 1.0;
    _damp_lb = 0.001;
    _rate_d = 0.1;
    _chglimit = 0.0;
    _acnvg = 0;
    _cnvg_lb = 0.001;
    _mcnvg = 2;
    _rate_c = -1.0;
    _ipunit = null;
    _extension = 'pcgn';
    _unitnumber = null;
    _filenames = null;

    get iter_mo() {
        return this._iter_mo;
    }

    set iter_mo(value) {
        this._iter_mo = value;
    }

    get iter_mi() {
        return this._iter_mi;
    }

    set iter_mi(value) {
        this._iter_mi = value;
    }

    get close_r() {
        return this._close_r;
    }

    set close_r(value) {
        this._close_r = value;
    }

    get close_h() {
        return this._close_h;
    }

    set close_h(value) {
        this._close_h = value;
    }

    get relax() {
        return this._relax;
    }

    set relax(value) {
        this._relax = value;
    }

    get ifill() {
        return this._ifill;
    }

    set ifill(value) {
        this._ifill = value;
    }

    get unit_pc() {
        return this._unit_pc;
    }

    set unit_pc(value) {
        this._unit_pc = value;
    }

    get unit_ts() {
        return this._unit_ts;
    }

    set unit_ts(value) {
        this._unit_ts = value;
    }

    get adamp() {
        return this._adamp;
    }

    set adamp(value) {
        this._adamp = value;
    }

    get damp() {
        return this._damp;
    }

    set damp(value) {
        this._damp = value;
    }

    get damp_lb() {
        return this._damp_lb;
    }

    set damp_lb(value) {
        this._damp_lb = value;
    }

    get rate_d() {
        return this._rate_d;
    }

    set rate_d(value) {
        this._rate_d = value;
    }

    get chglimit() {
        return this._chglimit;
    }

    set chglimit(value) {
        this._chglimit = value;
    }

    get acnvg() {
        return this._acnvg;
    }

    set acnvg(value) {
        this._acnvg = value;
    }

    get cnvg_lb() {
        return this._cnvg_lb;
    }

    set cnvg_lb(value) {
        this._cnvg_lb = value;
    }

    get mcnvg() {
        return this._mcnvg;
    }

    set mcnvg(value) {
        this._mcnvg = value;
    }

    get rate_c() {
        return this._rate_c;
    }

    set rate_c(value) {
        this._rate_c = value;
    }

    get ipunit() {
        return this._ipunit;
    }

    set ipunit(value) {
        this._ipunit = value;
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
