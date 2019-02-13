import Weight from './Weight';
import AbstractCollection from '../../collection/AbstractCollection';

class WeightsCollection extends AbstractCollection {
    static fromArray(array) {
        const wc = new WeightsCollection();
        wc.items = array.map(w => Weight.fromObject(w));
        return wc;
    }

    get allCriteriaIds() {
        return this.all.map(weight => weight.criterion.id);
    }

    get allRelations() {
        let relations = [];

        this.all.forEach(weight => {
            if (weight.relations.length > 0) {
                relations = relations.concat(
                    weight.relations.map(relation => {
                        return {
                            id: relation.id,
                            from: weight.criterion.id,
                            to: relation.to,
                            value: relation.value
                        }
                    })
                )
            }
        });

        return relations;
    }

    findByCriteriaId(id) {
        const c = this.all.filter(w => w.criterion.id === id);
        if (c.length > 0) {
            return c[0];
        }
        return null;
    }

    validateInput (weight) {
        if (!(weight instanceof Weight)) {
            throw new Error(`Weight expected to be instance of Weight but is type of ${typeof weight}`);
        }
        return weight;
    }
}

export default WeightsCollection;