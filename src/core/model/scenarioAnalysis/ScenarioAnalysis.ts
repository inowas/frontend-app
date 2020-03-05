import {cloneDeep} from 'lodash';
import moment from 'moment';

export interface IScenarioAnalysis {
    id: string;
    name: string;
    description: string;
    created_at: string;
    public: boolean;
    permissions: string;
    data: {
        base_id: string;
        scenario_ids: string[];
    };
}

export default class ScenarioAnalysis {

    get id() {
        return this._props.id;
    }

    set id(value) {
        this._props.id = value;
    }

    get name() {
        return this._props.name;
    }

    set name(value) {
        this._props.name = value;
    }

    get description() {
        return this._props.description;
    }

    set description(value) {
        this._props.description = value;
    }

    get createdAt() {
        return moment.utc(this._props.created_at);
    }

    set createdAt(value) {
        this._props.created_at = value.format('YYYY-MM-DD');
    }

    get public() {
        return this._props.public;
    }

    set public(value) {
        this._props.public = value;
    }

    get permissions() {
        return this._props.permissions;
    }

    set permissions(value) {
        this._props.permissions = value;
    }

    get basemodelId() {
        return this._props.data.base_id;
    }

    set basemodelId(value) {
        this._props.data.base_id = value;
    }

    get scenarioIds() {
        return this._props.data.scenario_ids;
    }

    set scenarioIds(value) {
        this._props.data.scenario_ids = value;
    }

    get modelIds() {
        return [this.basemodelId].concat(this.scenarioIds);
    }

    public static fromObject(obj: IScenarioAnalysis) {
        return new ScenarioAnalysis(obj);
    }

    private readonly _props: IScenarioAnalysis;

    constructor(props: IScenarioAnalysis) {
        this._props = cloneDeep(props);
    }

    public toObject = () => this._props;
}
