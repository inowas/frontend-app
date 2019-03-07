import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfde4 extends FlopyModflowPackage {

    _itmx = 50;
    _mxup = 0;
    _mxlow = 0;
    _mxbw = 0;
    _ifreq = 3;
    _mutd4 = 0;
    _accl = 1.0;
    _hclose = 1e-05;
    _iprd4 = 1;
    _extension = 'de4';
    _unitnumber = null;
    _filenames = null;
    
    get itmx() {
        return this._itmx;
    }

    set itmx(value) {
        this._itmx = value;
    }

    get mxup() {
        return this._mxup;
    }

    set mxup(value) {
        this._mxup = value;
    }

    get mxlow() {
        return this._mxlow;
    }

    set mxlow(value) {
        this._mxlow = value;
    }

    get mxbw() {
        return this._mxbw;
    }

    set mxbw(value) {
        this._mxbw = value;
    }

    get ifreq() {
        return this._ifreq;
    }

    set ifreq(value) {
        this._ifreq = value;
    }

    get mutd4() {
        return this._mutd4;
    }

    set mutd4(value) {
        this._mutd4 = value;
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

    get iprd4() {
        return this._iprd4;
    }

    set iprd4(value) {
        this._iprd4 = value;
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