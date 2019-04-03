import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfbcf extends FlopyModflowPackage {

    _ipakcb = null;
    _intercellt = 0;
    _laycon = 3;
    _trpy = 1.0;
    _hdry = -1e+30;
    _iwdflg = 0;
    _wetfct = 0.1;
    _iwetit = 1;
    _ihdwet = 0;
    _tran = 1.0;
    _hy = 1.0;
    _vcont = 1.0;
    _sf1 = 1e-05;
    _sf2 = 0.15;
    _wetdry = -0.01;
    _extension = 'bcf';
    _unitnumber = null;
    _filenames = null;

    get ipakcb() {
        return this._ipakcb;
    }

    set ipakcb(value) {
        this._ipakcb = value;
    }

    get intercellt() {
        return this._intercellt;
    }

    set intercellt(value) {
        this._intercellt = value;
    }

    get laycon() {
        return this._laycon;
    }

    set laycon(value) {
        this._laycon = value;
    }

    get trpy() {
        return this._trpy;
    }

    set trpy(value) {
        this._trpy = value;
    }

    get hdry() {
        return this._hdry;
    }

    set hdry(value) {
        this._hdry = value;
    }

    get iwdflg() {
        return this._iwdflg;
    }

    set iwdflg(value) {
        this._iwdflg = value;
    }

    get wetfct() {
        return this._wetfct;
    }

    set wetfct(value) {
        this._wetfct = value;
    }

    get iwetit() {
        return this._iwetit;
    }

    set iwetit(value) {
        this._iwetit = value;
    }

    get ihdwet() {
        return this._ihdwet;
    }

    set ihdwet(value) {
        this._ihdwet = value;
    }

    get tran() {
        return this._tran;
    }

    set tran(value) {
        this._tran = value;
    }

    get hy() {
        return this._hy;
    }

    set hy(value) {
        this._hy = value;
    }

    get vcont() {
        return this._vcont;
    }

    set vcont(value) {
        this._vcont = value;
    }

    get sf1() {
        return this._sf1;
    }

    set sf1(value) {
        this._sf1 = value;
    }

    get sf2() {
        return this._sf2;
    }

    set sf2(value) {
        this._sf2 = value;
    }

    get wetdry() {
        return this._wetdry;
    }

    set wetdry(value) {
        this._wetdry = value;
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