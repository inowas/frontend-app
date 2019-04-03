import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfnwi extends FlopyModflowPackage {

    _wel1flag = null;
    _qsumflag = null;
    _byndflag = null;
    _mnwobs = 1;
    _wellid_unit_qndflag_qhbflag_concflag = null;
    _extension = 'mnwi';
    _unitnumber = null;
    _filenames = null;

    get wel1flag() {
        return this._wel1flag;
    }

    set wel1flag(value) {
        this._wel1flag = value;
    }

    get qsumflag() {
        return this._qsumflag;
    }

    set qsumflag(value) {
        this._qsumflag = value;
    }

    get byndflag() {
        return this._byndflag;
    }

    set byndflag(value) {
        this._byndflag = value;
    }

    get mnwobs() {
        return this._mnwobs;
    }

    set mnwobs(value) {
        this._mnwobs = value;
    }

    get wellid_unit_qndflag_qhbflag_concflag() {
        return this._wellid_unit_qndflag_qhbflag_concflag;
    }

    set wellid_unit_qndflag_qhbflag_concflag(value) {
        this._wellid_unit_qndflag_qhbflag_concflag = value;
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
