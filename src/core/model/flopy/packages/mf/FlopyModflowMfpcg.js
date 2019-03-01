import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfpcg extends FlopyModflowPackage {

    _mxiter = 50;
    _iter1 = 30;
    _npcond = 1;
    _hclose = 1e-05;
    _rclose = 1e-05;
    _relax = 1.0;
    _nbpol = 0;
    _iprpcg = 0;
    _mutpcg = 3;
    _damp = 1.0;
    _dampt = 1.0;
    _ihcofadd = 0;
    _extension = 'pcg';
    _unitnumber = null;
    _filenames = null;

    get mxiter() {
        return this._mxiter;
    }

    set mxiter(value) {
        this._mxiter = value;
    }

    get iter1() {
        return this._iter1;
    }

    set iter1(value) {
        this._iter1 = value;
    }

    get npcond() {
        return this._npcond;
    }

    set npcond(value) {
        this._npcond = value;
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

    get nbpol() {
        return this._nbpol;
    }

    set nbpol(value) {
        this._nbpol = value;
    }

    get iprpcg() {
        return this._iprpcg;
    }

    set iprpcg(value) {
        this._iprpcg = value;
    }

    get mutpcg() {
        return this._mutpcg;
    }

    set mutpcg(value) {
        this._mutpcg = value;
    }

    get damp() {
        return this._damp;
    }

    set damp(value) {
        this._damp = value;
    }

    get dampt() {
        return this._dampt;
    }

    set dampt(value) {
        this._dampt = value;
    }

    get ihcofadd() {
        return this._ihcofadd;
    }

    set ihcofadd(value) {
        this._ihcofadd = value;
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
