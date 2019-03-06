import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMffhb extends FlopyModflowPackage {

    _nbdtim = 1;
    _nflw = 0;
    _nhed = 0;
    _ifhbss = 0;
    _ipakcb = null;
    _nfhbx1 = 0;
    _nfhbx2 = 0;
    _ifhbpt = 0;
    _bdtimecnstm = 1.0;
    _bdtime = [0.0];
    _cnstm5 = 1.0;
    _ds5 = null;
    _cnstm7 = 1.0;
    _ds7 = null;
    _extension = 'fhb';
    _unitnumber = null;
    _filenames = null;

    get nbdtim() {
        return this._nbdtim;
    }

    set nbdtim(value) {
        this._nbdtim = value;
    }

    get nflw() {
        return this._nflw;
    }

    set nflw(value) {
        this._nflw = value;
    }

    get nhed() {
        return this._nhed;
    }

    set nhed(value) {
        this._nhed = value;
    }

    get ifhbss() {
        return this._ifhbss;
    }

    set ifhbss(value) {
        this._ifhbss = value;
    }

    get ipakcb() {
        return this._ipakcb;
    }

    set ipakcb(value) {
        this._ipakcb = value;
    }

    get nfhbx1() {
        return this._nfhbx1;
    }

    set nfhbx1(value) {
        this._nfhbx1 = value;
    }

    get nfhbx2() {
        return this._nfhbx2;
    }

    set nfhbx2(value) {
        this._nfhbx2 = value;
    }

    get ifhbpt() {
        return this._ifhbpt;
    }

    set ifhbpt(value) {
        this._ifhbpt = value;
    }

    get bdtimecnstm() {
        return this._bdtimecnstm;
    }

    set bdtimecnstm(value) {
        this._bdtimecnstm = value;
    }

    get bdtime() {
        return this._bdtime;
    }

    set bdtime(value) {
        this._bdtime = value;
    }

    get cnstm5() {
        return this._cnstm5;
    }

    set cnstm5(value) {
        this._cnstm5 = value;
    }

    get ds5() {
        return this._ds5;
    }

    set ds5(value) {
        this._ds5 = value;
    }

    get cnstm7() {
        return this._cnstm7;
    }

    set cnstm7(value) {
        this._cnstm7 = value;
    }

    get ds7() {
        return this._ds7;
    }

    set ds7(value) {
        this._ds7 = value;
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
