import {Criterion} from '../../../../core/model/mcda/criteria';
import {GridSize} from '../../../../core/model/geometry';
import {MCDA} from '../../../../core/model/mcda';

export default {};

test('Create new MCDA project', () => {
    const mcda = MCDA.fromDefaults();
    mcda.gridSize = GridSize.fromObject({
        n_x: 25,
        n_y: 25
    });

    const criterion1 = Criterion.fromDefaults();
    criterion1.id = '123-abc-456';

    mcda.addCriterion(criterion1);
    mcda.addCriterion(Criterion.fromDefaults());
    expect(mcda.criteriaCollection.length).toEqual(2);

    criterion1.name = 'Test';
    mcda.updateCriterion(criterion1);
    expect(mcda.criteriaCollection.all[0].name).toBe('Test');

    mcda.removeCriterion('123-abc-456');
    expect(mcda.criteriaCollection.length).toEqual(1);
});
