import AbstractMt3dPackage from './AbstractMt3dPackage';

class GcgPackage extends AbstractMt3dPackage {

    _mxiter = 1;
    _iter1 = 50;
    _isolve = 3;
    _ncrs = 0;
    _accl = 1;
    _cclose = 1e-5;
    _iprgcg = 0;
    _extension = 'gcg';
    _unitnumber = null;
    _filenames = null;

    static fromDefault() {
        return new GcgPackage();
    }

    static fromObject(obj) {
        const gcg = new GcgPackage();
        gcg.metaDataFromObject(obj);
        gcg.mxiter = obj.mxiter;
        gcg.iter1 = obj.iter1;
        gcg.isolve = obj.isolve;
        gcg.ncrs = obj.ncrs;
        gcg.accl = obj.accl;
        gcg.cclose = obj.cclose;
        gcg.iprgcg = obj.iprgcg;
        gcg.extension = obj.extension;
        gcg.unitnumber = obj.unitnumber;
        gcg.filenames = obj.filenames;
        return gcg;
    }

    constructor() {
        super('gcg');
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

    get isolve() {
        return this._isolve;
    }

    set isolve(value) {
        this._isolve = value;
    }

    get ncrs() {
        return this._ncrs;
    }

    set ncrs(value) {
        this._ncrs = value;
    }

    get accl() {
        return this._accl;
    }

    set accl(value) {
        this._accl = value;
    }

    get cclose() {
        return this._cclose;
    }

    set cclose(value) {
        this._cclose = value;
    }

    get iprgcg() {
        return this._iprgcg;
    }

    set iprgcg(value) {
        this._iprgcg = value;
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

    toObject() {
        const obj = super.toObject();
        obj.mxiter = this.mxiter;
        obj.iter1 = this.iter1;
        obj.isolve = this.isolve;
        obj.ncrs = this.ncrs;
        obj.accl = this.accl;
        obj.cclose = this.cclose;
        obj.iprgcg = this.iprgcg;
        obj.extension = this.extension;
        obj.unitnumber = this.unitnumber;
        obj.filenames = this.filenames;
        return obj;
    }
}

export default GcgPackage;
