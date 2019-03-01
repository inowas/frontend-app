import FlopyModflowSerializable from './FlopyModflowSerializable';
import FlopyModflowMfbas from './FlopyModflowMfbas';
import FlopyModflowMfchd from './FlopyModflowMfchd';
import FlopyModflowMfdis from './FlopyModflowMfdis';
import FlopyModflowMfghb from './FlopyModflowMfghb';
import FlopyModflowMfhob from './FlopyModflowMfhob';
import FlopyModflowMflpf from './FlopyModflowMflpf';
import FlopyModflowMfoc from './FlopyModflowMfoc';
import FlopyModflowMfpcg from './FlopyModflowMfpcg';
import FlopyModflowMfrch from './FlopyModflowMfrch';
import FlopyModflowMfriv from './FlopyModflowMfriv';
import FlopyModflowMfwel from './FlopyModflowMfwel';

const packagesMap = {
    'bas': FlopyModflowMfbas,
    'chd': FlopyModflowMfchd,
    'dis': FlopyModflowMfdis,
    'ghb': FlopyModflowMfghb,
    'hob': FlopyModflowMfhob,
    'lpf': FlopyModflowMflpf,
    'oc': FlopyModflowMfoc,
    'pcg': FlopyModflowMfpcg,
    'rch': FlopyModflowMfrch,
    'riv': FlopyModflowMfriv,
    'wel': FlopyModflowMfwel
};

export default class FlopyModflowMf extends FlopyModflowSerializable {

    _packages = {
        mf: {
            modelname: 'modflowtest',
            namefile_ext: 'nam',
            version: 'mf2005',
            exe_name: 'mf2005.exe',
            structured: true,
            listunit: 2,
            model_ws: '.',
            external_path: null,
            verbose: false,
        }
    };

    constructor() {
        super();
        this.exe_name = 'mf2005';
    }

    get modelname() {
        return this._packages.mf.modelname;
    }

    set modelname(value) {
        this._packages.mf.modelname = value;
    }

    get namefile_ext() {
        return this._packages.mf.namefile_ext;
    }

    set namefile_ext(value) {
        this._packages.mf.namefile_ext = value;
    }

    get version() {
        return this._packages.mf.version;
    }

    set version(value) {
        this._packages.mf.version = value;
    }

    get exe_name() {
        return this._packages.mf.exe_name;
    }

    set exe_name(value) {
        this._packages.mf.exe_name = value;
    }

    get structured() {
        return this._packages.mf.structured;
    }

    set structured(value) {
        this._packages.mf.structured = value;
    }

    get listunit() {
        return this._packages.mf.listunit;
    }

    set listunit(value) {
        this._packages.mf.listunit = value;
    }

    get model_ws() {
        return this._packages.mf.model_ws;
    }

    set model_ws(value) {
        this._packages.mf.model_ws = value;
    }

    get external_path() {
        return this._packages.mf.external_path;
    }

    set external_path(value) {
        this._packages.mf.external_path = value;
    }

    get verbose() {
        return this._packages.mf.verbose;
    }

    set verbose(value) {
        this._packages.mf.verbose = value;
    }

    get packages() {
        return this._packages;
    }

    setPackage(p) {
        for (const name in packagesMap) {
            if (p instanceof packagesMap[name]) {
                this._packages[name] = p.toObject();
            }
        }
    }

    getPackage(name) {
        if (!this._packages[name]) {
            throw new Error('Package not found');
        }

        return packagesMap[name].fromObject(this._packages[name]);
    }
}
