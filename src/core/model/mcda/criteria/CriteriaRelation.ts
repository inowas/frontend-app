import uuidv4 from 'uuid/v4';

interface ICriteriaRelation {
    id: string;
    to: string;
    value: number;
}

class CriteriaRelation {

    public get id() {
        return this._id;
    }

    public set id(value) {
        this._id = value;
    }

    public get to() {
        return this._to;
    }

    public set to(value) {
        this._to = value;
    }

    public get value() {
        return this._value;
    }

    public set value(value) {
        this._value = value;
    }

    public static fromObject(obj: ICriteriaRelation) {
        const relation = new CriteriaRelation();
        relation.to = obj.to;
        relation.value = obj.value;
        relation.id = obj.id;
        return relation;
    }

    private _id = uuidv4();
    private _to = '';
    private _value = 0;

    public toObject() {
        return ({
            id: this.id,
            to: this.to,
            value: this.value
        });
    }
}

export default CriteriaRelation;
