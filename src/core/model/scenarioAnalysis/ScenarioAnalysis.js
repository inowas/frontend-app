import {includes} from 'lodash';
import {CalculationResults, GridSize, Soilmodel, Stressperiods} from '../modflow';

export default class ScenarioAnalysis {

    _id;
    _name;
    _description;
    _baseModelId;
    _createdAt;
    _public;
    _geometry;
    _gridSize;
    _boundingBox;
    _scenarios;
    _permissions;

    _results;
    _soilmodel;
    _stressperiods;

    static fromObject(obj) {
        const sa = new ScenarioAnalysis();
        sa._id = obj.id;
        sa._name = obj.name;
        sa._description = obj.description;
        sa._baseModelId = obj.base_model_id;
        sa._createdAt = obj.created_at;
        sa._public = obj.public;
        sa._geometry = obj.geometry;
        sa._gridSize = obj.grid_size;
        sa._boundingBox = obj.bounding_box;
        sa._baseModel = obj.base_model;
        sa._scenarios = obj.scenarios;
        sa._permissions = obj.permissions;
        sa._results = obj.results;
        sa._soilmodel = obj.soilmodel;
        sa._stressperiods = obj.stressperiods;
        return sa;
    }

    static fromQuery(query) {
        return ScenarioAnalysis.fromObject(query);
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    set public(value) {
        this._public = value;
    }

    get public() {
        return this._public;
    }

    get baseModelId() {
        return this._baseModelId;
    }

    get createdAt() {
        return this._createdAt;
    }

    get geometry() {
        return this._geometry;
    }

    get gridSize() {
        return this._gridSize ? GridSize.fromObject(this._gridSize) : this._gridSize;
    }

    get boundingBox() {
        return this._boundingBox;
    }

    get baseModel() {
        return this._baseModel;
    }

    get scenarios() {
        return this._scenarios;
    }

    get permissions() {
        return this._permissions;
    }

    get readOnly() {
        return !includes(this.permissions, 'w');
    }

    get models() {
        return [this.baseModel].concat(this.scenarios);
    }

    get results() {
        return this._results ? CalculationResults.fromObject(this._results) : this._results;
    }

    set results(value) {
        if (!(value instanceof CalculationResults)) {
            throw new Error('Value expected to be instance of CalculationResults');
        }

        this._results = value.toObject();
    }

    get soilmodel() {
        return this._soilmodel ? Soilmodel.fromObject(this._soilmodel) : this._soilmodel;
    }

    set soilmodel(value) {
        if (!(value instanceof Soilmodel)) {
            throw new Error('Value expected to be instance of Soilmodel');
        }

        this._soilmodel = value.toObject();
    }

    get stressperiods() {
        return this._stressperiods ? Stressperiods.fromObject(this._stressperiods) : this._stressperiods;
    }

    set stressperiods(value) {
        if (!(value instanceof Stressperiods)) {
            throw new Error('Value expected to be instance of Stressperiods');
        }

        this._stressperiods = value.toObject();
    }

    toObject = () => ({
        id: this._id,
        name: this._name,
        description: this._description,
        public: this._public,
        base_model_id: this._baseModelId,
        created_at: this._createdAt,
        geometry: this._geometry,
        grid_size: this._gridSize,
        bounding_box: this._boundingBox,
        base_model: this._baseModel,
        scenarios: this._scenarios,
        permissions: this._permissions,
        results: this._results,
        soilmodel: this._soilmodel,
        stressperiods: this._stressperiods,
    });
}
