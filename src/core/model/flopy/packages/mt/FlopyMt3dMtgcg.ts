import FlopyMt3dPackage from './FlopyMt3dPackage';

class FlopyMt3dMtgcg extends FlopyMt3dPackage {

    private _mxiter = 1;
    private _iter1 = 50;
    private _isolve = 3;
    private _ncrs = 0;
    private _accl = 1;
    private _cclose = 1e-5;
    private _iprgcg = 0;
    private _extension = 'gcg';
    private _unitnumber = null;
    private _filenames = null;

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
}

export default FlopyMt3dMtgcg;
