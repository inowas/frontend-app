export default class ScenarioAnalysis {

    _id;
    _name;
    _description;

    _createdAt;
    _public;

    _permissions;

    _basemodelId;
    _scenarioIds;

    static fromQuery(obj) {
        const sa = new ScenarioAnalysis();
        sa.id = obj.id;
        sa.name = obj.name;
        sa.description = obj.description;
        sa.createdAt = obj.created_at;
        sa.public = obj.public;
        sa.permissions = obj.permissions;

        sa.basemodelId = obj.data.base_id;
        sa.scenarioIds = obj.data.scenario_ids;
        return sa;
    }


    static fromObject(obj) {
        const sa = new ScenarioAnalysis();
        sa.id = obj.id;
        sa.name = obj.name;
        sa.description = obj.description;
        sa.createdAt = obj.created_at;
        sa.public = obj.public;
        sa.permissions = obj.permissions;

        sa.basemodelId = obj.basemodel_id;
        sa.scenarioIds = obj.scenario_ids;
        return sa;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
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

    get createdAt() {
        return this._createdAt;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    get public() {
        return this._public;
    }

    set public(value) {
        this._public = value;
    }

    get permissions() {
        return this._permissions;
    }

    set permissions(value) {
        this._permissions = value;
    }

    get basemodelId() {
        return this._basemodelId;
    }

    set basemodelId(value) {
        this._basemodelId = value;
    }

    get scenarioIds() {
        return this._scenarioIds;
    }

    set scenarioIds(value) {
        this._scenarioIds = value;
    }

    getModelIds() {
        return [this.basemodelId].concat(this.scenarioIds);
    }

    toObject = () => ({
        id: this.id,
        name: this.name,
        description: this.description,
        public: this.public,
        basemodel_id: this.basemodelId,
        created_at: this.createdAt,
        scenario_ids: this.scenarioIds,
        permissions: this.permissions
    });
}
