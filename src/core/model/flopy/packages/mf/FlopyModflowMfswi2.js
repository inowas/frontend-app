import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfswi2 extends FlopyModflowPackage {

    _nsrf = 1;
    _istrat = 1;
    _nobs = 0;
    _iswizt = null;
    _ipakcb = null;
    _iswiobs = 0;
    _options = null;
    _nsolver = 1;
    _iprsol = 0;
    _mutsol = 3;
    _solver2params = {
        'damp': 1.0,
        'dampt': 1.0,
        'iter1': 20,
        'mxiter': 100,
        'nbpol': 2,
        'npcond': 1,
        'rclose': 0.0001,
        'relax': 1.0,
        'zclose': 0.001
    };
    _toeslope = 0.05;
    _tipslope = 0.05;
    _alpha = null;
    _beta = 0.1;
    _nadptmx = 1;
    _nadptmn = 1;
    _adptfct = 1.0;
    _nu = 0.025;
    _zeta = [0.0];
    _ssz = 0.25;
    _isource = 0;
    _obsnam = null;
    _obslrc = null;
    _npln = null;
    _extension = 'swi2';
    _unitnumber = null;
    _filenames = null;

    get nsrf() {
        return this._nsrf;
    }

    set nsrf(value) {
        this._nsrf = value;
    }

    get istrat() {
        return this._istrat;
    }

    set istrat(value) {
        this._istrat = value;
    }

    get nobs() {
        return this._nobs;
    }

    set nobs(value) {
        this._nobs = value;
    }

    get iswizt() {
        return this._iswizt;
    }

    set iswizt(value) {
        this._iswizt = value;
    }

    get ipakcb() {
        return this._ipakcb;
    }

    set ipakcb(value) {
        this._ipakcb = value;
    }

    get iswiobs() {
        return this._iswiobs;
    }

    set iswiobs(value) {
        this._iswiobs = value;
    }

    get options() {
        return this._options;
    }

    set options(value) {
        this._options = value;
    }

    get nsolver() {
        return this._nsolver;
    }

    set nsolver(value) {
        this._nsolver = value;
    }

    get iprsol() {
        return this._iprsol;
    }

    set iprsol(value) {
        this._iprsol = value;
    }

    get mutsol() {
        return this._mutsol;
    }

    set mutsol(value) {
        this._mutsol = value;
    }

    get solver2params() {
        return this._solver2params;
    }

    set solver2params(value) {
        this._solver2params = value;
    }

    get toeslope() {
        return this._toeslope;
    }

    set toeslope(value) {
        this._toeslope = value;
    }

    get tipslope() {
        return this._tipslope;
    }

    set tipslope(value) {
        this._tipslope = value;
    }

    get alpha() {
        return this._alpha;
    }

    set alpha(value) {
        this._alpha = value;
    }

    get beta() {
        return this._beta;
    }

    set beta(value) {
        this._beta = value;
    }

    get nadptmx() {
        return this._nadptmx;
    }

    set nadptmx(value) {
        this._nadptmx = value;
    }

    get nadptmn() {
        return this._nadptmn;
    }

    set nadptmn(value) {
        this._nadptmn = value;
    }

    get adptfct() {
        return this._adptfct;
    }

    set adptfct(value) {
        this._adptfct = value;
    }

    get nu() {
        return this._nu;
    }

    set nu(value) {
        this._nu = value;
    }

    get zeta() {
        return this._zeta;
    }

    set zeta(value) {
        this._zeta = value;
    }

    get ssz() {
        return this._ssz;
    }

    set ssz(value) {
        this._ssz = value;
    }

    get isource() {
        return this._isource;
    }

    set isource(value) {
        this._isource = value;
    }

    get obsnam() {
        return this._obsnam;
    }

    set obsnam(value) {
        this._obsnam = value;
    }

    get obslrc() {
        return this._obslrc;
    }

    set obslrc(value) {
        this._obslrc = value;
    }

    get npln() {
        return this._npln;
    }

    set npln(value) {
        this._npln = value;
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
