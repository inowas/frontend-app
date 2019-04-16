import Uuid from 'uuid';

class Substance {

    _id = '';
    _name = '';
    _boundaryConcentrations = [];

    static create(name) {
        const substance = new Substance();
        substance._id = Uuid.v4();
        substance._name = name;
        return substance;
    }

    static fromObject(obj) {
        const substance = new Substance();
        substance._id = obj.id;
        substance._name = obj.name;
        substance._boundaryConcentrations = obj.boundaryConcentrations;
        return substance;
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

    get boundaryConcentrations() {
        return this._boundaryConcentrations;
    }

    set boundaryConcentrations(values) {
        this._boundaryConcentrations = values
    }

    addBoundaryId = (id) => {
        this._boundaryConcentrations.push({id: id, concentration: 0});
    };

    removeBoundaryId = (id) => {
        this._boundaryConcentrations = this._boundaryConcentrations.filter(bc => bc.id !== id);
    };

    updateConcentration = (boundaryId, concentration) => {
        this._boundaryConcentrations.map(bc => {
            if (bc.id === boundaryId) {
                bc.concentration = concentration;
            }

            return bc;
        });
    };

    toObject() {
        return {
            id: this.id,
            name: this._name,
            boundaryConcentrations: this._boundaryConcentrations,
        };
    }
}

export default Substance;
