import Criteria from "./Criteria";

class MCDA {
    _criteria = [];
    _waMethod = 'ranking';

    static fromObject(obj) {
        const mcda = new MCDA();
        mcda.criteria = obj.criteria.map(c => Criteria.fromObject(c));
        mcda.waMethod = obj.waMethod;
        return mcda;
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
            criteria: this.criteria.map(c => c.toObject),
            waMethod: this.waMethod
        });
    }

    addWeightAssignment() {

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

        this.criteria = this.criteria.map(c => {
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