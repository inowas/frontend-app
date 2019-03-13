import {Mt3dms} from './mt';
import FlopyModflow from './mf/FlopyModflow';
import md5 from 'md5';

export default class FlopyPackages {

    _flopy_version = '3.2.10';

    _author = '';
    _project = '';

    _model_id;
    _calculation_id;

    _mf;
    _mt;

    static fromObject(obj) {
        const mf = FlopyModflow.fromObject(obj.mf);
        const mt = Mt3dms.fromObject(obj.mt);
        const modelId = obj.model_id;

        const self = new this(modelId, mf, mt);
        self._flopy_version = obj.version;
        self._author = obj.author;
        self._project = obj.project;

        self._calculation_id = obj.calculation_id;
        return self;
    }

    constructor(modelId, mf, mt) {
        if (!(mf instanceof FlopyModflow)) {
            throw new Error('Mf has to be instance of FlopyModflowMf')
        }

        if (!(mt instanceof Mt3dms)) {
            throw new Error('Mt has to be instance of Mt3dms')
        }

        this._model_id = modelId;
        this._mf = mf;
        this._mt = mt;
        this.mf.setTransportEnabled(mt.enabled);
        this.calculateHash();
    }

    get flopy_version() {
        return this._flopy_version;
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
        return this._calculation_id;
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
        this.calculateHash();
    }

    get mt() {
        return this._mt;
    }

    set mt(value) {
        if (!(value instanceof Mt3dms)) {
            throw new Error('Mt has to be instance of Mt3dms')
        }
        this._mt = value;
        this.mf.setTransportEnabled(value.enabled);
        this.calculateHash();
    }

    getData = () => {
        const data = {};
        data['mf'] = this.mf.toFlopyCalculation();

        if (this._mt && this.mt.enabled) {
            data['mt'] = this.mt.toFlopyCalculation()
        }

        return data;
    };

    calculateHash = () => {
        this._calculation_id = this.hash(this.getData());
    };

    toObject = () => {
        return {
            author: this.author,
            version: this.flopy_version,
            model_id: this.model_id,
            project: this.project,
            mf: this.mf.toObject(),
            mt: this.mt.toObject()
        }
    };

    toFlopyCalculation = () => {
        return {
            author: this.author,
            project: this.project,
            version: this.flopy_version,
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
    }
}
