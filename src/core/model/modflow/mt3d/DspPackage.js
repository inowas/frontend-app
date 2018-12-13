import AbstractMt3dPackage from './AbstractMt3dPackage';

class DspPackage extends AbstractMt3dPackage {

    _al = 0.01;
    _trpt = 0.1;
    _trpv = 0.01;
    _dmcoef = 1e-9;
    _extension = 'dsp';
    _multiDiff = false;
    _unitnumber = null;
    _filenames = null;

    static fromDefault() {
        return new DspPackage();
    }

    static fromObject(obj) {
        const dsp = new DspPackage();
        dsp.metaDataFromObject(obj);
        dsp.al = obj.al;
        dsp.trpt = obj.trpt;
        dsp.trpv = obj.trpv;
        dsp.dmcoef = obj.dmcoef;
        dsp.extension = obj.extension;
        dsp.multiDiff = obj.multiDiff;
        dsp.unitnumber = obj.unitnumber;
        dsp.filenames = obj.filenames;
        return dsp;
    }

    constructor() {
        super('dsp');
    }

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

    get toObject() {
        const obj = super.toObject;
        obj.al = this.al;
        obj.trpt = this.trpt;
        obj.trpv = this.trpv;
        obj.dmcoef = this.dmcoef;
        obj.extension = this.extension;
        obj.multiDiff = this.multiDiff;
        obj.unitnumber = this.unitnumber;
        obj.filenames = this.filenames;
        return obj;
    }
}

export default DspPackage;
