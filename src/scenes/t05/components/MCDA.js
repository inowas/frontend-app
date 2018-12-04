import Criteria from "./Criteria";
import Weight from "./Weight";

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

    updateWeightAssignment(method) {
        let notOrdered = false;

        // Check if criteria already have wa-method 'ranking' and if not create it
        this.criteria = this.criteria.map(c => {

            let weight = c.getWeightByMethod(method);

            if (!weight) {
                notOrdered = true;

                const waMethod = Weight.fromMethod(method);
                c = c.updateWeight(waMethod);
            }

            return c;
        });

        // Reorder if necessary
        if (notOrdered) {
            this.calculateRanking('ranking');
            console.log('after Ranking', this);
        }

        return this;
    }

    calculateRanking(method) {
        const ranking = this.criteria.map(c => {
            const weight = c.getWeightByMethod(method);
            if (weight) {
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

        this.criteria = ranking.sort((a, b) => a.weight > b.weight).map((r, key) => {
            const criteria = r.criteria;
            const weight = criteria.getWeightByMethod(method);
            weight.rank = key + 1;
            criteria.updateWeight(weight);
            return criteria;
        });
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