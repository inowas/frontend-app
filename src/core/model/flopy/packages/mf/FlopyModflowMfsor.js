import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfsor extends FlopyModflowPackage {

    _mxiter = 200;
    _accl = 1;
    _hclose = 1e-05;
    _iprsor = 0;
    _extension = 'sor';
    _unitnumber = null;
    _filenames = null;

    get mxiter() {
        return this._mxiter;
    }

    set mxiter(value) {
        this._mxiter = value;
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

    get iprsor() {
        return this._iprsor;
    }

    set iprsor(value) {
        this._iprsor = value;
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
