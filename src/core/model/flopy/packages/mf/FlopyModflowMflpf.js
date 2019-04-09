import FlopyModflowFlowPackage from './FlopyModflowFlowPackage';

export default class FlopyModflowMflpf extends FlopyModflowFlowPackage {

    _laytyp = 0;
    _layavg = 0;
    _chani = 1.0;
    _layvka = 0;
    _laywet = 0;
    _ipakcb = null;
    _hdry = -1e+30;
    _iwdflg = 0;
    _wetfct = 0.1;
    _iwetit = 1;
    _ihdwet = 0;
    _hk = 1.0;
    _hani = 1.0;
    _vka = 1.0;
    _ss = 1e-05;
    _sy = 0.15;
    _vkcb = 0.0;
    _wetdry = -0.01;
    _storagecoefficient = false;
    _constantcv = false;
    _thickstrt = false;
    _nocvcorrection = false;
    _novfc = false;
    _extension = 'lpf';
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

    get wetdry() {
        return this._wetdry;
    }

    set wetdry(value) {
        this._wetdry = value;
    }

    get storagecoefficient() {
        return this._storagecoefficient;
    }

    set storagecoefficient(value) {
        this._storagecoefficient = value;
    }

    get constantcv() {
        return this._constantcv;
    }

    set constantcv(value) {
        this._constantcv = value;
    }

    get thickstrt() {
        return this._thickstrt;
    }

    set thickstrt(value) {
        this._thickstrt = value;
    }

    get nocvcorrection() {
        return this._nocvcorrection;
    }

    set nocvcorrection(value) {
        this._nocvcorrection = value;
    }

    get novfc() {
        return this._novfc;
    }

    set novfc(value) {
        this._novfc = value;
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

    supportedModflowVersions = () => [
        {name: 'MODFLOW-2005', executable: 'mf2005', version: 'mf2005', default: true}
    ]
}
