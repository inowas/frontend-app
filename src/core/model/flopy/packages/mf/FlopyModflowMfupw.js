import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfupw extends FlopyModflowPackage {

    _laytyp = 0;
    _layavg = 0;
    _chani = 1.0;
    _layvka = 0;
    _laywet = 0;
    _ipakcb = null;
    _hdry = -1e+30;
    _iphdry = 0;
    _hk = 1.0;
    _hani = 1.0;
    _vka = 1.0;
    _ss = 1e-05;
    _sy = 0.15;
    _vkcb = 0.0;
    _noparcheck = false;
    _extension = 'upw';
    _unitnumber = null;
    _filenames = null;

    get laytyp() {
        return this._laytyp;
    }

    set laytyp(value) {
        this._laytyp = value;
    }

    get layavg() {
        return this._layavg;
    }

    set layavg(value) {
        this._layavg = value;
    }

    get chani() {
        return this._chani;
    }

    set chani(value) {
        this._chani = value;
    }

    get layvka() {
        return this._layvka;
    }

    set layvka(value) {
        this._layvka = value;
    }

    get laywet() {
        return this._laywet;
    }

    set laywet(value) {
        this._laywet = value;
    }

    get ipakcb() {
        return this._ipakcb;
    }

    set ipakcb(value) {
        this._ipakcb = value;
    }

    get hdry() {
        return this._hdry;
    }

    set hdry(value) {
        this._hdry = value;
    }

    get iphdry() {
        return this._iphdry;
    }

    set iphdry(value) {
        this._iphdry = value;
    }

    get hk() {
        return this._hk;
    }

    set hk(value) {
        this._hk = value;
    }

    get hani() {
        return this._hani;
    }

    set hani(value) {
        this._hani = value;
    }

    get vka() {
        return this._vka;
    }

    set vka(value) {
        this._vka = value;
    }

    get ss() {
        return this._ss;
    }

    set ss(value) {
        this._ss = value;
    }

    get sy() {
        return this._sy;
    }

    set sy(value) {
        this._sy = value;
    }

    get vkcb() {
        return this._vkcb;
    }

    set vkcb(value) {
        this._vkcb = value;
    }

    get noparcheck() {
        return this._noparcheck;
    }

    set noparcheck(value) {
        this._noparcheck = value;
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
