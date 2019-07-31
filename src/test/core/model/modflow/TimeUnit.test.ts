import {TimeUnit} from '../../../../core/model/modflow';
import {ITimeUnit} from '../../../../core/model/modflow/TimeUnit.type';

test('TimeUnit', () => {
    const timeUnit = TimeUnit.fromInt(ITimeUnit.days);
    expect(timeUnit).toBeInstanceOf(TimeUnit);
    expect(timeUnit.toInt()).toEqual(ITimeUnit.days);
});
