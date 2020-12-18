import {IRule} from '../../../../../core/model/mcda/criteria/Rule.type';
import Rule from '../../../../../core/model/mcda/criteria/Rule';

export default {};

test('toObject, fromObject', () => {
    const rule = {
        id: 'rule1',
        color: '#000000',
        expression: '',
        name: 'Rule 1',
        from: 0,
        fromOperator: '>=',
        to: 100,
        toOperator: '<',
        type: 'fixed',
        value: 1
    };

    expect(Rule.fromObject(rule as IRule).toObject()).toEqual(rule);
});
