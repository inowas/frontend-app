import FlopyModflowSerializable from './FlopyModflowSerializable';
import {FlopyModflowMf} from './mf';
import {Mt3dms} from './mt';

export default class FlopyModelCalculation extends FlopyModflowSerializable {

    _flopy_version = '3.2.10';

    _author = '';
    _project = '';

    _calculation_id;
    _model_id;

    _data = {
        mf: null,
        mt: null
    };

    constructor(modelId, mf, mt) {
        super();
        this.model_id = modelId;
        this.mf = mf;
        this.mt = mt;
    }

    get flopy_version() {
        return this._flopy_version;
    }

    set flopy_version(value) {
        this._flopy_version = value;
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

    set calculation_id(value) {
        this._calculation_id = value;
    }

    get model_id() {
        return this._model_id;
    }

    set model_id(value) {
        this._model_id = value;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }

    get mf() {
        return FlopyModflowMf.fromObject(this._data.mf);
    }

    set mf(value) {
        if (!(value instanceof FlopyModflowMf)) {
            throw new Error('Mf has to be instance of FlopyModflowMf')
        }

        this._data.mf = value.toObject();
    }

    get mt() {
        return Mt3dms.fromObject(this._data.mt);
    }

    set mt(value) {
        if (!(value instanceof Mt3dms)) {
            throw new Error('Mt has to be instance of Mt3dms')
        }
        this._data.mt = value.toObject();
    }

    toFlopyCalculation = () => {
        const data = {};
        data['mf'] = this.mf.toFlopyCalculation();

        if (this.mt.enabled) {
            data['mt'] = this.mt.toFlopyCalculation()
        }

        return {
            author: this.author,
            project: this.project,
            version: this.flopy_version,
            calculation_id: this.hash(data),
            model_id: this.model_id,
            data
        }
    }
}
