import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfsip extends FlopyModflowPackage {

    _mxiter = 200;
    _nparm = 5;
    _accl = 1;
    _hclose = 1e-05;
    _ipcalc = 1;
    _wseed = 0;
    _iprsip = 0;
    _extension = 'sip';
    _unitnumber = null;
    _filenames = null;

    get mxiter() {
        return this._mxiter;
    }

    set mxiter(value) {
        this._mxiter = value;
    }

    get nparm() {
        return this._nparm;
    }

    set nparm(value) {
        this._nparm = value;
    }

    get accl() {
        return this._accl;
    }

    set accl(value) {
        this._accl = value;
    }

    get hclose() {
        return this._hclose;
    }

    set hclose(value) {
        this._hclose = value;
    }

    get ipcalc() {
        return this._ipcalc;
    }

    set ipcalc(value) {
        this._ipcalc = value;
    }

    get wseed() {
        return this._wseed;
    }

    set wseed(value) {
        this._wseed = value;
    }

    get iprsip() {
        return this._iprsip;
    }

    set iprsip(value) {
        this._iprsip = value;
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
