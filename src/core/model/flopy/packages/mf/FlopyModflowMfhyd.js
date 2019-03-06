import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfhyd extends FlopyModflowPackage {

    _nhyd = 1;
    _ihydun = null;
    _hydnoh = -999.0;
    _obsdata = [['BAS', 'HD', 'I', 0, 0.0, 0.0, 'HOBS1']];
    _extension = ['hyd', 'hyd.bin'];
    _unitnumber = null;
    _filenames = null;

    get nhyd() {
        return this._nhyd;
    }

    set nhyd(value) {
        this._nhyd = value;
    }

    get ihydun() {
        return this._ihydun;
    }

    set ihydun(value) {
        this._ihydun = value;
    }

    get hydnoh() {
        return this._hydnoh;
    }

    set hydnoh(value) {
        this._hydnoh = value;
    }

    get obsdata() {
        return this._obsdata;
    }

    set obsdata(value) {
        this._obsdata = value;
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
