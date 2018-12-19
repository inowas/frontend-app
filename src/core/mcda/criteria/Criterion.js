import uuidv4 from 'uuid/v4';

const validTypes = ['discrete', 'continuous'];

class Criterion {
    _id = uuidv4();
    _name = 'New Criterion';
    _type = 'discrete';
    _data = null;

    static fromObject(obj) {
        const criterion = new Criterion();
        criterion.id = obj.id;
        criterion.name = obj.name;
        criterion.type = obj.type;
        criterion.data = obj.data;
        return criterion;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value ? value : uuidv4();
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        if (!validTypes.includes(value)) {
            throw new Error(`Invalid type ${value} of Criteria`);
        }
        this._type = value;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value ? value : null;
    }

    toObject() {
        return ({
            id: this.id,
            name: this.name,
            type: this.type,
            data: this.data
        });
    }
}

export default Criterion;