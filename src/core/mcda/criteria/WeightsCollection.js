import Weight from './Weight';
import Criteria from './Criterion';
import AbstractCollection from '../../AbstractCollection';

class WeightsCollection extends AbstractCollection {
    static fromArray(array) {
        const wc = new WeightsCollection();
        wc.items = array.map(w => Weight.fromObject(w));
        return wc;
    }

    allRelations(method) {
        let relations = [];

        this.all.filter(weight => weight.method === method).forEach(weight => {
            if (weight.relations.length > 0) {
                relations = relations.concat(
                    weight.relations.map(relation => {
                        return {
                            id: relation.id,
                            from: weight.criteria.id,
                            to: relation.to,
                            value: relation.value
                        }
                    })
                )
            }
        });

        return relations;
    }

    validateInput (weight) {
        if (!(weight instanceof Weight)) {
            throw new Error(`Weight expected to be instance of Weight but is type of ${typeof weight}`);
        }
        return weight;
    }

    findByCriteriaAndMethod(criteria, method) {
        const id = criteria instanceof Criteria ? criteria.id : criteria;
        const weights = this._weights.filter(w => w.method === method && w.criteria.id === id);
        if (weights.length > 0) {
            return weights[0];
        }
        return false;
    }
}

export default WeightsCollection;