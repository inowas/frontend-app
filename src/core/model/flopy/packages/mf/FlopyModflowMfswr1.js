import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfswr1 extends FlopyModflowPackage {

    _extension = 'swr';
    _unitnumber = null;
    _filenames = null;


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
