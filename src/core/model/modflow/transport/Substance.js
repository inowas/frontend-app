import Uuid from 'uuid';

class Substance {

    _id = '';
    _name = '';
    _boundaryIds = [];
    _concentrations = [];

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
        substance._boundaryIds = obj.boundaryIds;
        substance._concentrations = obj.concentrations;
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

    get boundaryIds() {
        return this._boundaryIds;
    }

    set boundaryIds(values) {
        this._boundaryIds = values
    }

    get concentrations() {
        return this._concentrations;
    }

    set concentrations(value) {
        this._concentrations = value;
    }

    addBoundaryId = (id) => {
        this._boundaryIds.push(id);
        this._concentrations.push({id: id, concentration: 0})
    };

    removeBoundaryId = (id) => {
        this._boundaryIds = this._boundaryIds.filter(bid => bid !== id);
        this._concentrations = this._concentrations.filter(c => c.id !== id);
    };

    updateConcentration = (boundaryId, concentration) => {
        this._concentrations.map(c => {
            if (c.id === boundaryId) {
                c.concentration = concentration;
                return c;
            }

            return c;
        });
    };

    toObject() {
        return {
            id: this.id,
            name: this._name,
            boundaryIds: this._boundaryIds,
            concentrations: this._concentrations,
        };
    }
}

export default Substance;
