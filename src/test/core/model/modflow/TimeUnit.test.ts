import {ITimeUnit} from '../../../../core/model/modflow/TimeUnit.type';
import {TimeUnit} from '../../../../core/model/modflow';

test('TimeUnit static seconds', () => {
    const timeUnit = TimeUnit.seconds();
    expect(timeUnit).toBeInstanceOf(TimeUnit);
    expect(timeUnit.toInt()).toEqual(ITimeUnit.seconds);
});

test('TimeUnit static days', () => {
    const timeUnit = TimeUnit.days();
    expect(timeUnit).toBeInstanceOf(TimeUnit);
    expect(timeUnit.toInt()).toEqual(ITimeUnit.days);
});

test('TimeUnit static minutes', () => {
    const timeUnit = TimeUnit.minutes();
    expect(timeUnit).toBeInstanceOf(TimeUnit);
    expect(timeUnit.toInt()).toEqual(ITimeUnit.minutes);
});

test('TimeUnit static hours', () => {
    const timeUnit = TimeUnit.hours();
    expect(timeUnit).toBeInstanceOf(TimeUnit);
    expect(timeUnit.toInt()).toEqual(ITimeUnit.hours);
});

test('TimeUnit static years', () => {
    const timeUnit = TimeUnit.years();
    expect(timeUnit).toBeInstanceOf(TimeUnit);
    expect(timeUnit.toInt()).toEqual(ITimeUnit.years);
});

test('TimeUnit sameAs', () => {
    const timeUnit = TimeUnit.days();
    expect(timeUnit).toBeInstanceOf(TimeUnit);
    expect(timeUnit.sameAs(timeUnit)).toBeTruthy();
    expect(timeUnit.sameAs(TimeUnit.hours())).toBeFalsy();
});

test('TimeUnit fromInt', () => {
    const timeUnit = TimeUnit.fromInt(ITimeUnit.days);
    expect(timeUnit).toBeInstanceOf(TimeUnit);
    expect(timeUnit.toInt()).toEqual(ITimeUnit.days);
});
