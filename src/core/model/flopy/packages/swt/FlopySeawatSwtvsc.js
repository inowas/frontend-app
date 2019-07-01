import FlopySeawatPackage from './FlopySeawatPackage';

class FlopySeawatSwtvsc extends FlopySeawatPackage {

    _mt3dmuflg = -1;
    _viscmin = 0.0;
    _viscmax = 0.0;
    _viscref = 0.0008904;
    _nsmueos = 0;
    _mutempopt = 2;
    _mtmuspec = 1;
    _dmudc = 1.923e-06;
    _cmuref = 0.0;
    _mtmutempspec = 1;
    _amucoeff = null;
    _invisc = -1;
    _visc = -1;
    _extension = 'vsc';
    _unitnumber = null;
    _filenames = null;


    get mt3dmuflg() {
        return this._mt3dmuflg;
    }

    set mt3dmuflg(value) {
        value = parseInt(value);
        this._mt3dmuflg = value;
    }

    get viscmin() {
        return this._viscmin;
    }

    set viscmin(value) {
        value = parseFloat(value);
        this._viscmin = value;
    }

    get viscmax() {
        return this._viscmax;
    }

    set viscmax(value) {
        value = parseFloat(value);
        this._viscmax = value;
    }

    get viscref() {
        return this._viscref;
    }

    set viscref(value) {
        value = parseFloat(value);
        this._viscref = value;
    }

    get nsmueos() {
        return this._nsmueos;
    }

    set nsmueos(value) {
        value = parseInt(value);
        this._nsmueos = value;
    }

    get mutempopt() {
        return this._mutempopt;
    }

    set mutempopt(value) {
        value = parseInt(value);
        this._mutempopt = value;
    }

    get mtmuspec() {
        return this._mtmuspec;
    }

    set mtmuspec(value) {
        value = parseInt(value);
        this._mtmuspec = value;
    }

    get dmudc() {
        return this._dmudc;
    }

    set dmudc(value) {
        value = parseFloat(value);
        this._dmudc = value;
    }

    get cmuref() {
        return this._cmuref;
    }

    set cmuref(value) {
        value = parseFloat(value);
        this._cmuref = value;
    }

    get mtmutempspec() {
        return this._mtmutempspec;
    }

    set mtmutempspec(value) {
        value = parseInt(value);
        this._mtmutempspec = value;
    }

    get amucoeff() {
        return this._amucoeff;
    }

    set amucoeff(value) {
        this._amucoeff = value;
    }

    get invisc() {
        return this._invisc;
    }

    set invisc(value) {
        value = parseInt(value);
        this._invisc = value;
    }

    get visc() {
        return this._visc;
    }

    set visc(value) {
        value = parseInt(value);
        this._visc = value;
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

export default FlopySeawatSwtvsc;
