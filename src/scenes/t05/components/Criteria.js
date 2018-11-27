import uuidv4 from 'uuid/v4';
import Weight from "./Weight";

const validTypes = ['discrete', 'continuous'];

class Criteria {
    _id = uuidv4();
    _name = 'New Criteria';
    _type = 'discrete';
    _data = null;
    _weights = [];

    static fromObject(obj) {
        const criteria = new Criteria();
        criteria.id = obj.id;
        criteria.name = obj.name;
        criteria.type = obj.type;
        criteria.data = obj.data;
        criteria.weights = obj.weights.map(w => Weight.fromObject(w));
        return criteria;
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
        this._name = value ? value : 'New Criteria';
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

    get weights() {
        return this._weights;
    }

    set weights(value) {
        this._weights = value ? value : [];
    }

    get toObject() {
        return ({
            id: this.id,
            name: this.name,
            type: this.type,
            data: this.data,
            weights: this.weights.map(w => w.toObject)
        });
    }

    updateWeight(weight) {
        if (!(weight instanceof Weight)) {
            throw new Error(`Input parameter of Criteria@updateWeight must be instance of Weight.`);
        }

        let weightExists = false;

        this.weights = this.weights.map(w => {
            if(w.id === weight.id) {
                weightExists = true;
                return weight;
            }
            return w;
        });

        if(!weightExists) {
            this._weights.push(weight);
        }
        return this;
    }
}

export default Criteria;