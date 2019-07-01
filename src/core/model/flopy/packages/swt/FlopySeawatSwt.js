import FlopySeawatPackage from './FlopySeawatPackage';

class FlopySeawatSwt extends FlopySeawatPackage {

    _modelname = 'seawat-model';
    _namefile_ext = 'nam';
    _modflowmodel = null;
    _mt3dmodel = null;
    _version = 'seawat';
    _exe_name = 'swtv4';
    _structures = true;
    _listunit = 2;
    _model_ws = '.';
    _external_path = null;
    _verbose = false;
    _load = true;
    _silent = 0;

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

    get modflowmodel() {
        return this._modflowmodel;
    }

    set modflowmodel(value) {
        this._modflowmodel = value;
    }

    get mt3dmodel() {
        return this._mt3dmodel;
    }

    set mt3dmodel(value) {
        this._mt3dmodel = value;
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

    get structures() {
        return this._structures;
    }

    set structures(value) {
        this._structures = value;
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

    get load() {
        return this._load;
    }

    set load(value) {
        this._load = value;
    }

    get silent() {
        return this._silent;
    }

    set silent(value) {
        this._silent = value;
    }
}

export default FlopySeawatSwt;
