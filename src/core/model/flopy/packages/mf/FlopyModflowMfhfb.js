import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfhfb extends FlopyModflowPackage {

    _nphfb = 0;
    _mxfb = 0;
    _nhfbnp = 0;
    _hfb_data = null;
    _nacthfb = 0;
    _no_print = false;
    _options = null;
    _extension = 'hfb';
    _unitnumber = null;
    _filenames = null;

    get nphfb() {
        return this._nphfb;
    }

    set nphfb(value) {
        this._nphfb = value;
    }

    get mxfb() {
        return this._mxfb;
    }

    set mxfb(value) {
        this._mxfb = value;
    }

    get nhfbnp() {
        return this._nhfbnp;
    }

    set nhfbnp(value) {
        this._nhfbnp = value;
    }

    get hfb_data() {
        return this._hfb_data;
    }

    set hfb_data(value) {
        this._hfb_data = value;
    }

    get nacthfb() {
        return this._nacthfb;
    }

    set nacthfb(value) {
        this._nacthfb = value;
    }

    get no_print() {
        return this._no_print;
    }

    set no_print(value) {
        this._no_print = value;
    }

    get options() {
        return this._options;
    }

    set options(value) {
        this._options = value;
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
