import CriteriaRelation from '../../../../../core/model/mcda/criteria/CriteriaRelation';

export default {};

test('toObject, fromObject', () => {
    const relation = {
        id: 'c1',
        to: 'c2',
        value: 5
    };

    expect(CriteriaRelation.fromObject(relation).toObject()).toEqual(relation);
});
