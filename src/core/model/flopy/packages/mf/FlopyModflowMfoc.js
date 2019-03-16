import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMfoc extends FlopyModflowPackage {

    _ihedfm = 0;
    _iddnfm = 0;
    _chedfm = null;
    _cddnfm = null;
    _cboufm = null;
    _compact = true;
    _stress_period_data = [[[0, 0], ['save head']]];
    _extension = ['oc', 'hds', 'ddn', 'cbc', 'ibo'];
    _unitnumber = null;
    _filenames = null;
    _label = 'LABEL';

    get ihedfm() {
        return this._ihedfm;
    }

    set ihedfm(value) {
        this._ihedfm = value;
    }

    get iddnfm() {
        return this._iddnfm;
    }

    set iddnfm(value) {
        this._iddnfm = value;
    }

    get chedfm() {
        return this._chedfm;
    }

    set chedfm(value) {
        this._chedfm = value;
    }

    get cddnfm() {
        return this._cddnfm;
    }

    set cddnfm(value) {
        this._cddnfm = value;
    }

    get cboufm() {
        return this._cboufm;
    }

    set cboufm(value) {
        this._cboufm = value;
    }

    get compact() {
        return this._compact;
    }

    set compact(value) {
        this._compact = value;
    }

    get stress_period_data() {
        return this._stress_period_data;
    }

    set stress_period_data(value) {
        this._stress_period_data = value;
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

    get label() {
        return this._label;
    }

    set label(value) {
        this._label = value;
    }
}
