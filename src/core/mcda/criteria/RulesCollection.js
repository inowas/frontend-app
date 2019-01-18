import AbstractCollection from '../../AbstractCollection';
import Rule from './Rule';

class RulesCollection extends AbstractCollection {

    static fromArray(array) {
        const rc = new RulesCollection();
        rc.items = array.map(item => Rule.fromObject(item));
        return rc;
    }

    validateInput(rule) {
        if (!(rule instanceof Rule)) {
            throw new Error(`Rule expected to be instance of Rule but is instance of ${typeof rule}`);
        }
        return rule;
    }

    findByValue(value) {
        return this.all.filter(r => (r.fromOperator === '>' ? value > r.from : value >= r.from) && (r.toOperator === '<' ? value < r.to : value <= r.to));
    }

    isError(rule) {
        if (rule.min > rule.max) {
            return false;
        }

        return this.all.filter(r => r.id !== rule.id && (
            (rule.to > r.from && rule.from < r.to) ||
            (rule.to < r.to && rule.from > r.from)
        )).length > 0;
    }
}

export default RulesCollection;