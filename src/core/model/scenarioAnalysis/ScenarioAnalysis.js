import {includes} from 'lodash';

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
    _baseModel;
    _scenarios;
    _permissions;

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
        return this._gridSize;
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

    toObject = () => ({
        id: this.id,
        name: this.name,
        description: this.description,
        public: this.public,
        base_model_id: this.baseModelId,
        created_at: this.createdAt,
        geometry: this.geometry,
        grid_size: this.gridSize,
        bounding_box: this.boundingBox,
        base_model: this.baseModel,
        scenarios: this.scenarios,
        permissions: this.permissions
    });
}
