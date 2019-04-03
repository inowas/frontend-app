import Ajv from 'ajv';
import jsrp from 'json-schema-ref-parser';

import md5 from 'md5';
import FlopyModflow from './mf/FlopyModflow';
import FlopyMt3d from './mt/Mt3dms';
import {JSON_SCHEMA_URL} from 'services/api';

export default class FlopyPackages {

    _version = '3.2.10';

    _author = '';
    _project = '';

    _model_id;

    _mf;
    _mt;

    static create(modelId, mf, mt) {
        if (!(mf instanceof FlopyModflow)) {
            throw new Error('Mf has to be instance of FlopyModflowMf')
        }

        if (!(mt instanceof FlopyMt3d)) {
            throw new Error('Mt has to be instance of FlopyMt3d')
        }

        const self = new this();
        self.model_id = modelId;
        self.mf = mf;
        self.mt = mt;
        self.mf.setTransportEnabled(mt.enabled);
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
        const mt = FlopyMt3d.fromObject(obj.mt);
        const modelId = obj.model_id;

        const self = new this();
        self._model_id = modelId;
        self._mf = mf;
        self._mt = mt;
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

    getData = () => {
        const data = {};
        data['mf'] = this.mf.toFlopyCalculation();

        if (this._mt && this.mt.enabled) {
            data['mt'] = this.mt.toFlopyCalculation()
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
            mt: this.mt.toObject()
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
