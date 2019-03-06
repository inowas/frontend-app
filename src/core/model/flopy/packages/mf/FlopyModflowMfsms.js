import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfsms extends FlopyModflowPackage {

    _hclose = 0.0001;
    _hiclose = 0.0001;
    _mxiter = 100;
    _iter1 = 20;
    _iprsms = 2;
    _nonlinmeth = 0;
    _linmeth = 2;
    _theta = 0.7;
    _akappa = 0.1;
    _gamma = 0.2;
    _amomentum = 0.001;
    _numtrack = 20;
    _btol = 10000.0;
    _breduc = 0.2;
    _reslim = 100.0;
    _iacl = 2;
    _norder = 0;
    _level = 7;
    _north = 2;
    _iredsys = 0;
    _rrctol = 0.0;
    _idroptol = 0;
    _epsrn = 0.001;
    _clin = 'bcgs';
    _ipc = 3;
    _iscl = 0;
    _iord = 0;
    _rclosepcgu = 0.1;
    _relaxpcgu = 1.0;
    _extension = 'sms';
    _options = null;
    _unitnumber = null;
    _filenames = null;

    get hclose() {
        return this._hclose;
    }

    set hclose(value) {
        this._hclose = value;
    }

    get hiclose() {
        return this._hiclose;
    }

    set hiclose(value) {
        this._hiclose = value;
    }

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

    get iprsms() {
        return this._iprsms;
    }

    set iprsms(value) {
        this._iprsms = value;
    }

    get nonlinmeth() {
        return this._nonlinmeth;
    }

    set nonlinmeth(value) {
        this._nonlinmeth = value;
    }

    get linmeth() {
        return this._linmeth;
    }

    set linmeth(value) {
        this._linmeth = value;
    }

    get theta() {
        return this._theta;
    }

    set theta(value) {
        this._theta = value;
    }

    get akappa() {
        return this._akappa;
    }

    set akappa(value) {
        this._akappa = value;
    }

    get gamma() {
        return this._gamma;
    }

    set gamma(value) {
        this._gamma = value;
    }

    get amomentum() {
        return this._amomentum;
    }

    set amomentum(value) {
        this._amomentum = value;
    }

    get numtrack() {
        return this._numtrack;
    }

    set numtrack(value) {
        this._numtrack = value;
    }

    get btol() {
        return this._btol;
    }

    set btol(value) {
        this._btol = value;
    }

    get breduc() {
        return this._breduc;
    }

    set breduc(value) {
        this._breduc = value;
    }

    get reslim() {
        return this._reslim;
    }

    set reslim(value) {
        this._reslim = value;
    }

    get iacl() {
        return this._iacl;
    }

    set iacl(value) {
        this._iacl = value;
    }

    get norder() {
        return this._norder;
    }

    set norder(value) {
        this._norder = value;
    }

    get level() {
        return this._level;
    }

    set level(value) {
        this._level = value;
    }

    get north() {
        return this._north;
    }

    set north(value) {
        this._north = value;
    }

    get iredsys() {
        return this._iredsys;
    }

    set iredsys(value) {
        this._iredsys = value;
    }

    get rrctol() {
        return this._rrctol;
    }

    set rrctol(value) {
        this._rrctol = value;
    }

    get idroptol() {
        return this._idroptol;
    }

    set idroptol(value) {
        this._idroptol = value;
    }

    get epsrn() {
        return this._epsrn;
    }

    set epsrn(value) {
        this._epsrn = value;
    }

    get clin() {
        return this._clin;
    }

    set clin(value) {
        this._clin = value;
    }

    get ipc() {
        return this._ipc;
    }

    set ipc(value) {
        this._ipc = value;
    }

    get iscl() {
        return this._iscl;
    }

    set iscl(value) {
        this._iscl = value;
    }

    get iord() {
        return this._iord;
    }

    set iord(value) {
        this._iord = value;
    }

    get rclosepcgu() {
        return this._rclosepcgu;
    }

    set rclosepcgu(value) {
        this._rclosepcgu = value;
    }

    get relaxpcgu() {
        return this._relaxpcgu;
    }

    set relaxpcgu(value) {
        this._relaxpcgu = value;
    }

    get extension() {
        return this._extension;
    }

    set extension(value) {
        this._extension = value;
    }

    get options() {
        return this._options;
    }

    set options(value) {
        this._options = value;
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
