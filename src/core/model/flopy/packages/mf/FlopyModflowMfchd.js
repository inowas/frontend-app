import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfchd extends FlopyModflowPackage {

    _stress_period_data = null;
    _dtype = null;
    _options = null;
    _extension = 'chd';
    _unitnumber = null;
    _filenames = null;

    get stress_period_data() {
        return this._stress_period_data;
    }

    set stress_period_data(value) {
        this._stress_period_data = value;
    }

    get dtype() {
        return this._dtype;
    }

    set dtype(value) {
        this._dtype = value;
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
