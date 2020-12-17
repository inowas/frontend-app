import {ICriteriaRelation} from './CriteriaRelation.type';
import {cloneDeep} from 'lodash';
import uuidv4 from 'uuid/v4';

class CriteriaRelation {

    public get id() {
        return this._props.id;
    }

    public set id(value) {
        this._props.id = value;
    }

    public get to() {
        return this._props.to;
    }

    public set to(value) {
        this._props.to = value;
    }

    public get value() {
        return this._props.value;
    }

    public set value(value) {
        this._props.value = value;
    }

    public static fromDefaults() {
        return new CriteriaRelation({
            id: uuidv4(),
            to: '',
            value: 0
        });
    }

    public static fromObject(obj: ICriteriaRelation) {
        return new CriteriaRelation(obj);
    }

    private readonly _props: ICriteriaRelation;

    constructor(obj: ICriteriaRelation) {
        this._props = obj;
    }

    public toObject() {
        return cloneDeep(this._props);
    }
}

export default CriteriaRelation;
