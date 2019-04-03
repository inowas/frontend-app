import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfgage extends FlopyModflowPackage {

    _numgage = 0;
    _gage_data = null;
    _files = null;
    _extension = 'gage';
    _unitnumber = null;
    _filenames = null;

    get numgage() {
        return this._numgage;
    }

    set numgage(value) {
        this._numgage = value;
    }

    get gage_data() {
        return this._gage_data;
    }

    set gage_data(value) {
        this._gage_data = value;
    }

    get files() {
        return this._files;
    }

    set files(value) {
        this._files = value;
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
