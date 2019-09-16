import uuidv4 from 'uuid/v4';
import {ICriteriaRelation} from './CriteriaRelation.type';

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
        return new CriteriaRelation({
            to: obj.to,
            value: obj.value,
            id: obj.id
        });
    }

    private _props: ICriteriaRelation;

    constructor(obj: ICriteriaRelation) {
        this._props = obj;
    }

    public toObject() {
        return ({
            id: this.id,
            to: this.to,
            value: this.value
        });
    }
}

export default CriteriaRelation;
