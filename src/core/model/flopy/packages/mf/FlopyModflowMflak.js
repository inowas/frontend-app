import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowMflak extends FlopyModflowPackage {

    _nlakes = 1;
    _ipakcb = null;
    _theta = -1.0;
    _nssitr = 0;
    _sscncr = 0.0;
    _surfdep = 0.0;
    _stages = 1.0;
    _stage_range = null;
    _tab_files = null;
    _tab_units = null;
    _lakarr = null;
    _bdlknc = null;
    _sill_data = null;
    _flux_data = null;
    _extension = 'lak';
    _unitnumber = null;
    _filenames = null;
    _options = null;

    get nlakes() {
        return this._nlakes;
    }

    set nlakes(value) {
        this._nlakes = value;
    }

    get ipakcb() {
        return this._ipakcb;
    }

    set ipakcb(value) {
        this._ipakcb = value;
    }

    get theta() {
        return this._theta;
    }

    set theta(value) {
        this._theta = value;
    }

    get nssitr() {
        return this._nssitr;
    }

    set nssitr(value) {
        this._nssitr = value;
    }

    get sscncr() {
        return this._sscncr;
    }

    set sscncr(value) {
        this._sscncr = value;
    }

    get surfdep() {
        return this._surfdep;
    }

    set surfdep(value) {
        this._surfdep = value;
    }

    get stages() {
        return this._stages;
    }

    set stages(value) {
        this._stages = value;
    }

    get stage_range() {
        return this._stage_range;
    }

    set stage_range(value) {
        this._stage_range = value;
    }

    get tab_files() {
        return this._tab_files;
    }

    set tab_files(value) {
        this._tab_files = value;
    }

    get tab_units() {
        return this._tab_units;
    }

    set tab_units(value) {
        this._tab_units = value;
    }

    get lakarr() {
        return this._lakarr;
    }

    set lakarr(value) {
        this._lakarr = value;
    }

    get bdlknc() {
        return this._bdlknc;
    }

    set bdlknc(value) {
        this._bdlknc = value;
    }

    get sill_data() {
        return this._sill_data;
    }

    set sill_data(value) {
        this._sill_data = value;
    }

    get flux_data() {
        return this._flux_data;
    }

    set flux_data(value) {
        this._flux_data = value;
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

    get options() {
        return this._options;
    }

    set options(value) {
        this._options = value;
    }
}
