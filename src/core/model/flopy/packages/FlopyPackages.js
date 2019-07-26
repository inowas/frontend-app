import Ajv from 'ajv';
import jsrp from 'json-schema-ref-parser';

import md5 from 'md5';
import FlopyModflow from './mf/FlopyModflow';
import FlopyMt3d from './mt/FlopyMt3d';
import FlopySeawat from './swt/FlopySeawat';

import {JSON_SCHEMA_URL} from '../../../../services/api';
import FlopyModpath from "./modpath/FlopyModpath";
import {Modpath} from "../../../../scenes/t03/components/content/modpath";

export default class FlopyPackages {

    _version = '3.2.12';

    _author = '';
    _project = '';

    _model_id;

    _mf;
    _modpath;
    _mt;
    _swt;

    static create(modelId, mf, modpath, mt, swt) {
        if (!(mf instanceof FlopyModflow)) {
            throw new Error('Mf has to be instance of FlopyModflowMf')
        }

        if (!(modpath instanceof FlopyModpath)) {
            throw new Error('Modpath has to be instance of FlopyModpath')
        }

        if (!(mt instanceof FlopyMt3d)) {
            throw new Error('Mt has to be instance of FlopyMt3d')
        }

        if (!(swt instanceof FlopySeawat)) {
            throw new Error('Swt has to be instance of FlopySeawat')
        }

        const self = new this();
        self.model_id = modelId;
        self.mf = mf;
        self.modpath = modpath;
        self.mt = mt;
        self.mf.setTransportEnabled(mt.enabled);
        self.swt = swt;

        return self;
    }

    static fromQuery(obj) {
        if (obj === []) {
            return null;
        }

        return FlopyPackages.fromObject(obj);
    }

    static fromObject(obj) {
        const mf = FlopyModflow.fromObject(obj.mf);
        const modpath = obj.modpath ? FlopyModpath.fromObject(obj.modpath) : new FlopyModpath();
        const mt = FlopyMt3d.fromObject(obj.mt);
        const swt = obj.swt ? FlopySeawat.fromObject(obj.swt) : new FlopySeawat();
        const modelId = obj.model_id;

        const self = new this();
        self._model_id = modelId;
        self._mf = mf;
        self._modpath = modpath;
        self._mt = mt;
        self._swt = swt;
        self._version = obj.version;
        self._author = obj.author;
        self._project = obj.project;
        return self;
    }

    get version() {
        return this._version;
    }

    get author() {
        return this._author;
    }

    set author(value) {
        this._author = value;
    }

    get project() {
        return this._project;
    }

    set project(value) {
        this._project = value;
    }

    get calculation_id() {
        return this.hash(this.getData());
    }

    get model_id() {
        return this._model_id;
    }

    set model_id(value) {
        this._model_id = value;
    }

    get mf() {
        return this._mf;
    }

    set mf(value) {
        if (!(value instanceof FlopyModflow)) {
            throw new Error('Mf has to be instance of FlopyModflowMf')
        }

        this._mf = value;
    }

    get modpath() {
        return this._modpath;
    }

    set modpath(value) {
        if (!(value instanceof FlopyModpath)) {
            throw new Error('Modpath has to be instance of FlopyModpath')
        }

        this._modpath = value;
    }

    get mt() {
        return this._mt;
    }

    set mt(value) {
        if (!(value instanceof FlopyMt3d)) {
            throw new Error('Mt has to be instance of FlopyMt3d')
        }
        this._mt = value;
        this.mf.setTransportEnabled(value.enabled);
    }

    get swt() {
        return this._swt;
    }

    set swt(value) {
        if (!(value instanceof FlopySeawat)) {
            throw new Error('Swt has to be instance of FlopySeawat')
        }
        this._swt = value;
    }

    getData = () => {
        const data = {};
        data['mf'] = this.mf.toFlopyCalculation();

        if (this.modpath) {
            data['modpath'] = this.modpath.toCalculation();
        }

        if (this.mt && this.mt.enabled) {
            data['mt'] = this.mt.toFlopyCalculation();
        }

        if (this.swt && this.swt.enabled) {
            data['swt'] = this.swt.toFlopyCalculation();
        }

        return data;
    };

    toObject = () => {
        return {
            author: this.author,
            project: this.project,
            version: this.version,
            model_id: this.model_id,
            mf: this.mf.toObject(),
            modpath: this.modpath.toObject(),
            mt: this.mt.toObject(),
            swt: this.swt.toObject()
        }
    };

    toFlopyCalculation = () => {
        return {
            author: this.author,
            project: this.project,
            version: this.version,
            calculation_id: this.calculation_id,
            model_id: this.model_id,
            data: this.getData()
        }
    };

    sort = (object) => {
        const sortedObj = {};
        const keys = Object.keys(object);

        keys.sort((key1, key2) => {
            key1 = key1.toLowerCase();
            key2 = key2.toLowerCase();

            if (key1 < key2) return -1;
            if (key1 > key2) return 1;
            return 0;
        });

        for (let index in keys) {
            const key = keys[index];
            if (typeof object[key] == 'object' && !(object[key] instanceof Array) && !(object[key] === null)) {
                sortedObj[key] = this.sort(object[key]);
            } else {
                sortedObj[key] = object[key];
            }
        }

        return sortedObj;
    };

    hash = (data) => {
        const sorted = this.sort(data);
        return md5(JSON.stringify(sorted));
    };

    validate(forCalculationServer = true) {

        let schema = JSON_SCHEMA_URL + '/modflow/packages/flopyCalculationPackages.json';
        let data = this.toObject();
        if (forCalculationServer) {
            schema = JSON_SCHEMA_URL + '/modflow/packages/flopyCalculation.json';
            data = this.toFlopyCalculation();
        }

        return new Promise((resolve) => {
            const ajv = new Ajv({schemaId: 'auto'});
            jsrp.dereference({'$ref': schema})
                .then(schema => {
                    const val = ajv.compile(schema);
                    const isValid = val(data);
                    const errors = val.errors;

                    if (!isValid) {
                        console.warn('Invalid ' + data, schema, JSON.stringify(errors));
                    }

                    resolve([isValid, errors]);
                })
                .catch(e => {
                    console.log(e);
                    resolve([false, e]);
                });
        });
    }
}
