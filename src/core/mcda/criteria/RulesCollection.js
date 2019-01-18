import AbstractCollection from '../../AbstractCollection';
import Rule from './Rule';

class RulesCollection extends AbstractCollection {

    static fromArray(array) {
        const rc = new RulesCollection();
        rc.items = array.map(item => Rule.fromObject(item));
        return rc;
    }

    validateInput (rule) {
        if (!(rule instanceof Rule)) {
            throw new Error(`Rule expected to be instance of Rule but is instance of ${typeof rule}`);
        }
        return rule;
    }
}

export default RulesCollection;