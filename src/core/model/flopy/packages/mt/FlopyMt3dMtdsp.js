import FlopyMt3dPackage from './FlopyMt3dPackage';

class FlopyMt3dMtdsp extends FlopyMt3dPackage {

    _al = 0.01;
    _trpt = 0.1;
    _trpv = 0.01;
    _dmcoef = 1e-9;
    _extension = 'dsp';
    _multiDiff = false;
    _unitnumber = null;
    _filenames = null;

    get al() {
        return this._al;
    }

    set al(value) {
        this._al = value;
    }

    get trpt() {
        return this._trpt;
    }

    set trpt(value) {
        this._trpt = value;
    }

    get trpv() {
        return this._trpv;
    }

    set trpv(value) {
        this._trpv = value;
    }

    get dmcoef() {
        return this._dmcoef;
    }

    set dmcoef(value) {
        this._dmcoef = value;
    }

    get extension() {
        return this._extension;
    }

    set extension(value) {
        this._extension = value;
    }

    get multiDiff() {
        return this._multiDiff;
    }

    set multiDiff(value) {
        this._multiDiff = value;
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

export default FlopyMt3dMtdsp;
