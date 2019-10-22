import FlopyModflowSolverPackage from './FlopyModflowSolverPackage';

export default class FlopyModflowMfnwt extends FlopyModflowSolverPackage {

    _headtol = 0.01;
    _fluxtol = 500;
    _maxiterout = 100;
    _thickfact = 1e-05;
    _linmeth = 1;
    _iprnwt = 0;
    _ibotav = 0;
    _options = 'COMPLEX';
    _Continue = false;
    _dbdtheta = 0.4;
    _dbdkappa = 1e-05;
    _dbdgamma = 0.0;
    _momfact = 0.1;
    _backflag = 1;
    _maxbackiter = 50;
    _backtol = 1.1;
    _backreduce = 0.7;
    _maxitinner = 50;
    _ilumethod = 2;
    _levfill = 5;
    _stoptol = 1e-10;
    _msdr = 15;
    _iacl = 2;
    _norder = 1;
    _level = 5;
    _north = 7;
    _iredsys = 0;
    _rrctols = 0.0;
    _idroptol = 1;
    _epsrn = 0.0001;
    _hclosexmd = 0.0001;
    _mxiterxmd = 50;
    _extension = 'nwt';
    _unitnumber = null;
    _filenames = null;

    get headtol() {
        return this._headtol;
    }

    set headtol(value) {
        this._headtol = value;
    }

    get fluxtol() {
        return this._fluxtol;
    }

    set fluxtol(value) {
        this._fluxtol = value;
    }

    get maxiterout() {
        return this._maxiterout;
    }

    set maxiterout(value) {
        this._maxiterout = value;
    }

    get thickfact() {
        return this._thickfact;
    }

    set thickfact(value) {
        this._thickfact = value;
    }

    get linmeth() {
        return this._linmeth;
    }

    set linmeth(value) {
        this._linmeth = value;
    }

    get iprnwt() {
        return this._iprnwt;
    }

    set iprnwt(value) {
        this._iprnwt = value;
    }

    get ibotav() {
        return this._ibotav;
    }

    set ibotav(value) {
        this._ibotav = value;
    }

    get options() {
        return this._options;
    }

    set options(value) {
        this._options = value;
    }

    get Continue() {
        return this._Continue;
    }

    set Continue(value) {
        this._Continue = value;
    }

    get dbdtheta() {
        return this._dbdtheta;
    }

    set dbdtheta(value) {
        this._dbdtheta = value;
    }

    get dbdkappa() {
        return this._dbdkappa;
    }

    set dbdkappa(value) {
        this._dbdkappa = value;
    }

    get dbdgamma() {
        return this._dbdgamma;
    }

    set dbdgamma(value) {
        this._dbdgamma = value;
    }

    get momfact() {
        return this._momfact;
    }

    set momfact(value) {
        this._momfact = value;
    }

    get backflag() {
        return this._backflag;
    }

    set backflag(value) {
        this._backflag = value;
    }

    get maxbackiter() {
        return this._maxbackiter;
    }

    set maxbackiter(value) {
        this._maxbackiter = value;
    }

    get backtol() {
        return this._backtol;
    }

    set backtol(value) {
        this._backtol = value;
    }

    get backreduce() {
        return this._backreduce;
    }

    set backreduce(value) {
        this._backreduce = value;
    }

    get maxitinner() {
        return this._maxitinner;
    }

    set maxitinner(value) {
        this._maxitinner = value;
    }

    get ilumethod() {
        return this._ilumethod;
    }

    set ilumethod(value) {
        this._ilumethod = value;
    }

    get levfill() {
        return this._levfill;
    }

    set levfill(value) {
        this._levfill = value;
    }

    get stoptol() {
        return this._stoptol;
    }

    set stoptol(value) {
        this._stoptol = value;
    }

    get msdr() {
        return this._msdr;
    }

    set msdr(value) {
        this._msdr = value;
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

    get rrctols() {
        return this._rrctols;
    }

    set rrctols(value) {
        this._rrctols = value;
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

    get hclosexmd() {
        return this._hclosexmd;
    }

    set hclosexmd(value) {
        this._hclosexmd = value;
    }

    get mxiterxmd() {
        return this._mxiterxmd;
    }

    set mxiterxmd(value) {
        this._mxiterxmd = value;
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
