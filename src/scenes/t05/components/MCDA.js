import uuidv4 from 'uuid/v4';
import Criteria from "./Criteria";

class MCDA {
    _id = uuidv4();
    _name = 'New Multi-criteria decision analysis';
    _criteria = [];
    _waMethod = 'ranking';

    static fromObject(obj) {
        const mcda = new MCDA();
        mcda.id = obj.id;
        mcda.name = obj.name;
        mcda.criteria = obj.criteria.map(c => Criteria.fromObject(c));
        mcda.waMethod = obj.waMethod;
        return mcda;
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
        this._name = value ? value : 'New Multi-criteria decision analysis';
    }

    get criteria() {
        return this._criteria;
    }

    set criteria(value) {
        this._criteria = value ? value : [];
    }

    get waMethod() {
        return this._waMethod;
    }

    set waMethod(value) {
        this._waMethod = value ? value : 'ranking';
    }

    get toObject() {
        return ({
            id: this.id,
            name: this.name,
            criteria: this.criteria.map(c => c.toObject),
            waMethod: this.waMethod
        });
    }

    calculateRanking() {
        const ranking = this.criteria.map(c => {
            const weight = c.weights.filter(w => w.type === this.waMethod)[0];
            if (weight !== null) {
                return {
                    criteria: c,
                    weight: weight.value
                }
            }
            return {
                criteria: c,
                weight: 0
            }
        });

        this.criteria = ranking.sort((a, b) => a.weight > b.weight).map((r, key) => ({
            ...r.criteria,
            rank: key + 1
        }));
    }

    updateCriteria(criteria) {
        if (!(criteria instanceof Criteria)) {
            throw new Error(`Input parameter of MCDA@updateCriteria must be instance of Criteria.`);
        }

        let criteriaExists = false;

        this.weights = this.weights.map(c => {
            if (c.id === criteria.id) {
                criteriaExists = true;
                return criteria;
            }
            return c;
        });

        if (!criteriaExists) {
            this._criteria.push(criteria);
        }
        return this;
    }
}

export default MCDA;