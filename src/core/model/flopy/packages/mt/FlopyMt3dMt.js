import FlopyMt3dPackage from './FlopyMt3dPackage';

class FlopyMt3dMt extends FlopyMt3dPackage {

    _modelname = 'mt3d-model';
    _namefile_ext = 'nam';
    _exe_name = 'mt3dms';
    _model_ws = '.';
    _ftlfilename = 'mt3d_link.ftl';
    _version = 'mt3dms';
    _verbose = false;

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

    get exe_name() {
        return this._exe_name;
    }

    set exe_name(value) {
        this._exe_name = value;
    }

    get model_ws() {
        return this._model_ws;
    }

    set model_ws(value) {
        this._model_ws = value;
    }

    get ftlfilename() {
        return this._ftlfilename;
    }

    set ftlfilename(value) {
        this._ftlfilename = value;
    }

    get version() {
        return this._version;
    }

    set version(value) {
        this._version = value;
    }

    get verbose() {
        return this._verbose;
    }

    set verbose(value) {
        this._verbose = value;
    }
}

export default FlopyMt3dMt;
