import {SoilmodelParameter} from 'core/model/modflow/soilmodel';
import {defaultParameters} from 'scenes/t03/defaults/soilmodel';

const param = defaultParameters.top;
const top = SoilmodelParameter.fromObject(param);

test('From object, to object', () => {
    expect(top).toBeInstanceOf(SoilmodelParameter);
    expect(top.toObject()).toEqual(defaultParameters.top);
    expect(top.isArray()).toBeFalsy();
    expect(typeof SoilmodelParameter.parseValue(top.value)).toBe('number');
});

test('Parameter is array or NaN', () => {
    top.value = [[0, 0, 0],[0, 1, 1],[1, 1, 2]];
    expect(top.isArray()).toBe(true);
    expect(Array.isArray(SoilmodelParameter.parseValue(top.value))).toBe(true);
    expect(SoilmodelParameter.parseValue('TEST')).toEqual(0);

    param.value = 'TEST';
    const topNoParse = SoilmodelParameter.fromObject(param, false);
    expect(SoilmodelParameter.parseValue(topNoParse.value)).toEqual(0);
});