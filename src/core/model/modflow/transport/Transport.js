import SubstanceCollection from './SubstanceCollection';

// SET stress_period_data
// ssm_data[0] = [
//      [#lay, #row, #col, #value1, #itype, #value1, #value2)]
//      [4, 4, 4, 1.0, itype['GHB'], 1.0, 100.0)]
// ]
class Transport {

    _enabled = false;
    _substances = new SubstanceCollection();

    static fromQuery(query) {
        return Transport.fromObject(query)
    }

    static fromObject(obj) {
        const transport = new Transport();
        transport.enabled = obj.enabled || false;
        transport.substances = SubstanceCollection.fromArray(obj.substances || []);
        return transport;
    }

    get enabled() {
        return this._enabled;
    }

    set enabled(value) {
        this._enabled = value;
    }

    get substances() {
        return this._substances;
    }

    set substances(value) {
        this._substances = value;
    }

    addSubstance = substance => {
        this.substances.addSubstance(substance);
    };

    removeSubstanceById = substanceId => {
        this.substances.removeSubstanceById(substanceId);
    };

    updateSubstance = substance => {
        this.substances.update(substance, false);
    };

    toObject = () => {
        return {
            enabled: this.enabled,
            substances: this.substances.toArray(),
        }
    };
}

export default Transport;
