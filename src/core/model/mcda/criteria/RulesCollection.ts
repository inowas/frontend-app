import {Collection} from '../../collection/Collection';
import Rule from './Rule';
import {IRule} from './Rule.type';

class RulesCollection extends Collection<Rule> {
    public static fromArray(array: IRule[]) {
        const rc = new RulesCollection();
        rc.items = array.map((item) => Rule.fromObject(item));
        return rc;
    }

    public findByValue(value: number) {
        return this.all.filter(
            (r) => (r.fromOperator === '>' ? value > r.from : value >= r.from)
                && (r.toOperator === '<' ? value < r.to : value <= r.to)
        );
    }

    public isError(rule: Rule) {
        if (rule.from > rule.to) {
            return true;
        }

        return this.all.filter((r) => r.id !== rule.id && (
            (rule.to > r.from && rule.from < r.to) ||
            (rule.to < r.to && rule.from > r.from)
        )).length > 0;
    }
}

export default RulesCollection;
