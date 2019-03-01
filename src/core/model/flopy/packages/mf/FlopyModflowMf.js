
export default class FlopyModflowMf {

    _modelname = 'modflowtest';
    _namefile_ext = 'nam';
    _version = 'mf2005';
    _exe_name = 'mf2005.exe';
    _structured = true;
    _listunit = 2;
    _model_ws = '.';
    _external_path = null;
    _verbose = false;

    constructor() {
        this.exe_name = 'mf2005';
    }

    get modelname() {
        return this._modelname;
    }

    set modelname(value) {
        this._modelname = value;
    }

    get namefile_ext() {
        return this._namefile_ext;
    }

    set namefile_ext(value) {
        this._namefile_ext = value;
    }

    get version() {
        return this._version;
    }

    set version(value) {
        this._version = value;
    }

    get exe_name() {
        return this._exe_name;
    }

    set exe_name(value) {
        this._exe_name = value;
    }

    get structured() {
        return this._structured;
    }

    set structured(value) {
        this._structured = value;
    }

    get listunit() {
        return this._listunit;
    }

    set listunit(value) {
        this._listunit = value;
    }

    get model_ws() {
        return this._model_ws;
    }

    set model_ws(value) {
        this._model_ws = value;
    }

    get external_path() {
        return this._external_path;
    }

    set external_path(value) {
        this._external_path = value;
    }

    get verbose() {
        return this._verbose;
    }

    set verbose(value) {
        this._verbose = value;
    }
}
