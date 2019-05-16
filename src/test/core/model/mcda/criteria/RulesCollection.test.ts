import {Rule, RulesCollection} from '../../../../../core/model/mcda/criteria';

export default {};

const rule1 = Rule.fromObject({
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
});
const rule2 = Rule.fromObject({
    id: 'rule2',
    color: '#000000',
    expression: '',
    name: 'Rule 2',
    from: 100,
    fromOperator: '>=',
    to: 200,
    toOperator: '<',
    type: 'fixed',
    value: 2
});

const rc = new RulesCollection();
rc.add(rule1).add(rule2);

test('Adding rules and find by value', () => {
    const findByValue = rc.findByValue(101);

    expect(rc.length).toEqual(2);
    expect(findByValue[0].name).toEqual('Rule 2');
});

test('Remove rule and isError', () => {
    const rule3 = Rule.fromObject({
        id: 'rule3',
        color: '#000000',
        expression: '',
        name: 'Rule 3',
        from: 199,
        fromOperator: '>=',
        to: 198,
        toOperator: '<',
        type: 'fixed',
        value: 1.9
    });

    expect(rc.isError(rule3)).toBeTruthy();

    rule3.from = 190;

    expect(rc.isError(rule3)).toBeTruthy();

    rule3.from = 200;
    rule3.to = 300;

    expect(rc.isError(rule3)).toBeFalsy();
});
