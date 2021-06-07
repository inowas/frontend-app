import {Collection} from '../../collection/Collection';
import {IRule} from './Rule.type';
import {cloneDeep} from 'lodash';

class RulesCollection extends Collection<IRule> {
    public static fromObject(obj: IRule[]) {
        return new RulesCollection(obj);
    }

    public findByValue(value: number) {
        return this.all.filter(
            (r) => (r.fromOperator === '>' ? value > r.from : value >= r.from)
                && (r.toOperator === '<' ? value < r.to : value <= r.to)
        );
    }

    public isError(rule: IRule) {
        return rule.from > rule.to || this.all.filter((r) => r.id !== rule.id && (
            (rule.to > r.from && rule.from < r.to) ||
            (rule.to < r.to && rule.from > r.from)
        )).length > 0;
    }

    public toObject() {
        return cloneDeep(this.all);
    }
}

export default RulesCollection;
