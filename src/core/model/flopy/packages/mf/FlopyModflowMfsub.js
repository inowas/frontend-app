import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfsub extends FlopyModflowPackage {

    _pakcb = null;
    _isuboc = 0;
    _idsave = null;
    _idrest = null;
    _nndb = 1;
    _ndb = 1;
    _nmz = 1;
    _nn = 20;
    _ac1 = 0.0;
    _ac2 = 1.0;
    _itmin = 5;
    _ln = 0;
    _ldn = 0;
    _rnb = 1;
    _hc = 100000.0;
    _sfe = 0.0001;
    _sfv = 0.001;
    _com = 0.0;
    _dp = [[1e-06, 6e-06, 0.0006]];
    _dstart = 1.0;
    _dhc = 100000.0;
    _dcom = 0.0;
    _dz = 1.0;
    _nz = 1;
    _ids15 = null;
    _ids16 = null;
    _extension = 'sub';
    _unitnumber = null;
    _filenames = null;

    get pakcb() {
        return this._pakcb;
    }

    set pakcb(value) {
        this._pakcb = value;
    }

    get isuboc() {
        return this._isuboc;
    }

    set isuboc(value) {
        this._isuboc = value;
    }

    get idsave() {
        return this._idsave;
    }

    set idsave(value) {
        this._idsave = value;
    }

    get idrest() {
        return this._idrest;
    }

    set idrest(value) {
        this._idrest = value;
    }

    get nndb() {
        return this._nndb;
    }

    set nndb(value) {
        this._nndb = value;
    }

    get ndb() {
        return this._ndb;
    }

    set ndb(value) {
        this._ndb = value;
    }

    get nmz() {
        return this._nmz;
    }

    set nmz(value) {
        this._nmz = value;
    }

    get nn() {
        return this._nn;
    }

    set nn(value) {
        this._nn = value;
    }

    get ac1() {
        return this._ac1;
    }

    set ac1(value) {
        this._ac1 = value;
    }

    get ac2() {
        return this._ac2;
    }

    set ac2(value) {
        this._ac2 = value;
    }

    get itmin() {
        return this._itmin;
    }

    set itmin(value) {
        this._itmin = value;
    }

    get ln() {
        return this._ln;
    }

    set ln(value) {
        this._ln = value;
    }

    get ldn() {
        return this._ldn;
    }

    set ldn(value) {
        this._ldn = value;
    }

    get rnb() {
        return this._rnb;
    }

    set rnb(value) {
        this._rnb = value;
    }

    get hc() {
        return this._hc;
    }

    set hc(value) {
        this._hc = value;
    }

    get sfe() {
        return this._sfe;
    }

    set sfe(value) {
        this._sfe = value;
    }

    get sfv() {
        return this._sfv;
    }

    set sfv(value) {
        this._sfv = value;
    }

    get com() {
        return this._com;
    }

    set com(value) {
        this._com = value;
    }

    get dp() {
        return this._dp;
    }

    set dp(value) {
        this._dp = value;
    }

    get dstart() {
        return this._dstart;
    }

    set dstart(value) {
        this._dstart = value;
    }

    get dhc() {
        return this._dhc;
    }

    set dhc(value) {
        this._dhc = value;
    }

    get dcom() {
        return this._dcom;
    }

    set dcom(value) {
        this._dcom = value;
    }

    get dz() {
        return this._dz;
    }

    set dz(value) {
        this._dz = value;
    }

    get nz() {
        return this._nz;
    }

    set nz(value) {
        this._nz = value;
    }

    get ids15() {
        return this._ids15;
    }

    set ids15(value) {
        this._ids15 = value;
    }

    get ids16() {
        return this._ids16;
    }

    set ids16(value) {
        this._ids16 = value;
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
