import Criteria from './Criteria';

class CriteriaCollection {
    _criteria = [];

    static fromObject(obj) {
        const cc = new CriteriaCollection();
        cc.criteria = obj.criteria.map(c => Criteria.fromObject(c));
        return cc;
    }

    get criteria() {
        return this._criteria;
    }

    set criteria(value) {
        this._criteria = value || [];
    }

    get toObject() {
        return ({
            criteria: this.all.map(c => c.toObject)
        });
    }

    get all() {
        return this._criteria;
    }

    findById(id) {
        const criteria = this._criteria.filter(c => c.id === id);
        if (criteria.length > 0) {
            return criteria[0];
        }
        return false;
    }

    add(criteria) {
        if (!(criteria instanceof Criteria)) {
            throw new Error('Criteria expected to be of type Criteria.');
        }
        this._criteria.push(criteria);

        return this;
    }

    remove(criteria) {
        const id = criteria instanceof Criteria ? criteria.id : criteria;
        this._criteria = this._criteria.filter(c => c.id !== id);

        return this;
    }

    update(criteria) {
        if (!(criteria instanceof Criteria)) {
            throw new Error('Criteria expected to be of type Criteria.');
        }

        let exists = false;
        this._criteria = this._criteria.map(c => {
            if (criteria.id === c.id) {
                exists = true;
                return criteria;
            }
            return c;
        });

        if (!exists) {
            this.add(criteria);
        }

        return this;
    }
}

export default CriteriaCollection;