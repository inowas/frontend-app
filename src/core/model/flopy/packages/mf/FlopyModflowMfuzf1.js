import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfuzf1 extends FlopyModflowPackage {

    _nuztop = 1;
    _iuzfopt = 0;
    _irunflg = 0;
    _ietflg = 0;
    _ipakcb = null;
    _iuzfcb2 = null;
    _ntrail2 = 10;
    _nsets = 20;
    _surfdep = 1.0;
    _iuzfbnd = 1;
    _irunbnd = 0;
    _vks = 1e-06;
    _eps = 3.5;
    _thts = 0.35;
    _thtr = 0.15;
    _thti = 0.2;
    _specifythtr = 0;
    _specifythti = 0;
    _nosurfleak = 0;
    _finf = 1e-08;
    _pet = 5e-08;
    _extdp = 15.0;
    _extwc = 0.1;
    _nwt_11_fmt = false;
    _specifysurfk = false;
    _rejectsurfk = false;
    _seepsurfk = false;
    _etsquare = null;
    _netflux = null;
    _nuzgag = null;
    _uzgag = null;
    _extension = 'uzf';
    _unitnumber = null;
    _filenames = null;

    get nuztop() {
        return this._nuztop;
    }

    set nuztop(value) {
        this._nuztop = value;
    }

    get iuzfopt() {
        return this._iuzfopt;
    }

    set iuzfopt(value) {
        this._iuzfopt = value;
    }

    get irunflg() {
        return this._irunflg;
    }

    set irunflg(value) {
        this._irunflg = value;
    }

    get ietflg() {
        return this._ietflg;
    }

    set ietflg(value) {
        this._ietflg = value;
    }

    get ipakcb() {
        return this._ipakcb;
    }

    set ipakcb(value) {
        this._ipakcb = value;
    }

    get iuzfcb2() {
        return this._iuzfcb2;
    }

    set iuzfcb2(value) {
        this._iuzfcb2 = value;
    }

    get ntrail2() {
        return this._ntrail2;
    }

    set ntrail2(value) {
        this._ntrail2 = value;
    }

    get nsets() {
        return this._nsets;
    }

    set nsets(value) {
        this._nsets = value;
    }

    get surfdep() {
        return this._surfdep;
    }

    set surfdep(value) {
        this._surfdep = value;
    }

    get iuzfbnd() {
        return this._iuzfbnd;
    }

    set iuzfbnd(value) {
        this._iuzfbnd = value;
    }

    get irunbnd() {
        return this._irunbnd;
    }

    set irunbnd(value) {
        this._irunbnd = value;
    }

    get vks() {
        return this._vks;
    }

    set vks(value) {
        this._vks = value;
    }

    get eps() {
        return this._eps;
    }

    set eps(value) {
        this._eps = value;
    }

    get thts() {
        return this._thts;
    }

    set thts(value) {
        this._thts = value;
    }

    get thtr() {
        return this._thtr;
    }

    set thtr(value) {
        this._thtr = value;
    }

    get thti() {
        return this._thti;
    }

    set thti(value) {
        this._thti = value;
    }

    get specifythtr() {
        return this._specifythtr;
    }

    set specifythtr(value) {
        this._specifythtr = value;
    }

    get specifythti() {
        return this._specifythti;
    }

    set specifythti(value) {
        this._specifythti = value;
    }

    get nosurfleak() {
        return this._nosurfleak;
    }

    set nosurfleak(value) {
        this._nosurfleak = value;
    }

    get finf() {
        return this._finf;
    }

    set finf(value) {
        this._finf = value;
    }

    get pet() {
        return this._pet;
    }

    set pet(value) {
        this._pet = value;
    }

    get extdp() {
        return this._extdp;
    }

    set extdp(value) {
        this._extdp = value;
    }

    get extwc() {
        return this._extwc;
    }

    set extwc(value) {
        this._extwc = value;
    }

    get nwt_11_fmt() {
        return this._nwt_11_fmt;
    }

    set nwt_11_fmt(value) {
        this._nwt_11_fmt = value;
    }

    get specifysurfk() {
        return this._specifysurfk;
    }

    set specifysurfk(value) {
        this._specifysurfk = value;
    }

    get rejectsurfk() {
        return this._rejectsurfk;
    }

    set rejectsurfk(value) {
        this._rejectsurfk = value;
    }

    get seepsurfk() {
        return this._seepsurfk;
    }

    set seepsurfk(value) {
        this._seepsurfk = value;
    }

    get etsquare() {
        return this._etsquare;
    }

    set etsquare(value) {
        this._etsquare = value;
    }

    get netflux() {
        return this._netflux;
    }

    set netflux(value) {
        this._netflux = value;
    }

    get nuzgag() {
        return this._nuzgag;
    }

    set nuzgag(value) {
        this._nuzgag = value;
    }

    get uzgag() {
        return this._uzgag;
    }

    set uzgag(value) {
        this._uzgag = value;
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
