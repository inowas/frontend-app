import {ILengthUnit} from '../../../../core/model/modflow/LengthUnit.type';
import {LengthUnit} from '../../../../core/model/modflow';

test('LengthUnit static feet', () => {
    const lengthUnit = LengthUnit.feet();
    expect(lengthUnit).toBeInstanceOf(LengthUnit);
    expect(lengthUnit.toInt()).toEqual(ILengthUnit.feet);
});

test('LengthUnit static meters', () => {
    const lengthUnit = LengthUnit.meters();
    expect(lengthUnit).toBeInstanceOf(LengthUnit);
    expect(lengthUnit.toInt()).toEqual(ILengthUnit.meters);
});

test('LengthUnit static centimeters', () => {
    const lengthUnit = LengthUnit.centimeters();
    expect(lengthUnit).toBeInstanceOf(LengthUnit);
    expect(lengthUnit.toInt()).toEqual(ILengthUnit.centimeters);
});

test('LengthUnit sameAs', () => {
    const lengthUnit = LengthUnit.meters();
    expect(lengthUnit).toBeInstanceOf(LengthUnit);
    expect(lengthUnit.sameAs(lengthUnit)).toBeTruthy();
    expect(lengthUnit.sameAs(LengthUnit.centimeters())).toBeFalsy();
});

test('TimeUnit fromInt', () => {
    const lengthUnit = LengthUnit.fromInt(ILengthUnit.meters);
    expect(lengthUnit).toBeInstanceOf(LengthUnit);
    expect(lengthUnit.toInt()).toEqual(ILengthUnit.meters);
});
