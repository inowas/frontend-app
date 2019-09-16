import uuidv4 from 'uuid/v4';
import { ICriteriaRelation } from './CriteriaRelation.type';
import {IWeight} from './Weight.type';

class Weight {

    get id() {
        return this._props.id;
    }

    set id(value) {
        this._props.id = value ? value : uuidv4();
    }

    get initialValue() {
        return this._props.initialValue;
    }

    set initialValue(value) {
        this._props.initialValue = value;
    }

    get criterion() {
        return this._props.criterion;
    }

    set criterion(value) {
        this._props.criterion = value;
    }

    get relations(): ICriteriaRelation[] {
        return this._props.relations;
    }

    set relations(value: ICriteriaRelation[]) {
        this._props.relations = value || [];
    }

    get value() {
        return this._props.value;
    }

    set value(value) {
        this._props.value = value;
    }

    public static fromDefaults() {
        return new Weight({
            id: uuidv4(),
            criterion: null,
            initialValue: 0,
            relations: [],
            value: 0
        });
    }

    public static fromObject(obj: IWeight) {
        return new Weight(obj);
    }
    protected _props: IWeight;

    constructor(obj: IWeight) {
        this._props = obj;
    }

    public toObject() {
        return this._props;
    }
}

export default Weight;
