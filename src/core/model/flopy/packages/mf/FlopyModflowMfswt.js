import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfswt extends FlopyModflowPackage {

    _ipakcb = null;
    _iswtoc = 0;
    _nsystm = 1;
    _ithk = 0;
    _ivoid = 0;
    _istpcs = 1;
    _icrcc = 0;
    _lnwt = 0;
    _izcfl = 0;
    _izcfm = 0;
    _iglfl = 0;
    _iglfm = 0;
    _iestfl = 0;
    _iestfm = 0;
    _ipcsfl = 0;
    _ipcsfm = 0;
    _istfl = 0;
    _istfm = 0;
    _gl0 = 0.0;
    _sgm = 1.7;
    _sgs = 2.0;
    _thick = 1.0;
    _sse = 1.0;
    _ssv = 1.0;
    _cr = 0.01;
    _cc = 0.25;
    _void = 0.82;
    _sub = 0.0;
    _pcsoff = 0.0;
    _pcs = 0.0;
    _ids16 = null;
    _ids17 = null;
    _extension = 'swt';
    _unitnumber = null;
    _filenames = null;

    get ipakcb() {
        return this._ipakcb;
    }

    set ipakcb(value) {
        this._ipakcb = value;
    }

    get iswtoc() {
        return this._iswtoc;
    }

    set iswtoc(value) {
        this._iswtoc = value;
    }

    get nsystm() {
        return this._nsystm;
    }

    set nsystm(value) {
        this._nsystm = value;
    }

    get ithk() {
        return this._ithk;
    }

    set ithk(value) {
        this._ithk = value;
    }

    get ivoid() {
        return this._ivoid;
    }

    set ivoid(value) {
        this._ivoid = value;
    }

    get istpcs() {
        return this._istpcs;
    }

    set istpcs(value) {
        this._istpcs = value;
    }

    get icrcc() {
        return this._icrcc;
    }

    set icrcc(value) {
        this._icrcc = value;
    }

    get lnwt() {
        return this._lnwt;
    }

    set lnwt(value) {
        this._lnwt = value;
    }

    get izcfl() {
        return this._izcfl;
    }

    set izcfl(value) {
        this._izcfl = value;
    }

    get izcfm() {
        return this._izcfm;
    }

    set izcfm(value) {
        this._izcfm = value;
    }

    get iglfl() {
        return this._iglfl;
    }

    set iglfl(value) {
        this._iglfl = value;
    }

    get iglfm() {
        return this._iglfm;
    }

    set iglfm(value) {
        this._iglfm = value;
    }

    get iestfl() {
        return this._iestfl;
    }

    set iestfl(value) {
        this._iestfl = value;
    }

    get iestfm() {
        return this._iestfm;
    }

    set iestfm(value) {
        this._iestfm = value;
    }

    get ipcsfl() {
        return this._ipcsfl;
    }

    set ipcsfl(value) {
        this._ipcsfl = value;
    }

    get ipcsfm() {
        return this._ipcsfm;
    }

    set ipcsfm(value) {
        this._ipcsfm = value;
    }

    get istfl() {
        return this._istfl;
    }

    set istfl(value) {
        this._istfl = value;
    }

    get istfm() {
        return this._istfm;
    }

    set istfm(value) {
        this._istfm = value;
    }

    get gl0() {
        return this._gl0;
    }

    set gl0(value) {
        this._gl0 = value;
    }

    get sgm() {
        return this._sgm;
    }

    set sgm(value) {
        this._sgm = value;
    }

    get sgs() {
        return this._sgs;
    }

    set sgs(value) {
        this._sgs = value;
    }

    get thick() {
        return this._thick;
    }

    set thick(value) {
        this._thick = value;
    }

    get sse() {
        return this._sse;
    }

    set sse(value) {
        this._sse = value;
    }

    get ssv() {
        return this._ssv;
    }

    set ssv(value) {
        this._ssv = value;
    }

    get cr() {
        return this._cr;
    }

    set cr(value) {
        this._cr = value;
    }

    get cc() {
        return this._cc;
    }

    set cc(value) {
        this._cc = value;
    }

    get void() {
        return this._void;
    }

    set void(value) {
        this._void = value;
    }

    get sub() {
        return this._sub;
    }

    set sub(value) {
        this._sub = value;
    }

    get pcsoff() {
        return this._pcsoff;
    }

    set pcsoff(value) {
        this._pcsoff = value;
    }

    get pcs() {
        return this._pcs;
    }

    set pcs(value) {
        this._pcs = value;
    }

    get ids16() {
        return this._ids16;
    }

    set ids16(value) {
        this._ids16 = value;
    }

    get ids17() {
        return this._ids17;
    }

    set ids17(value) {
        this._ids17 = value;
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
