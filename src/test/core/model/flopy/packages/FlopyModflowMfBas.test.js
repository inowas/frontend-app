import FlopyModflowMf from 'core/model/flopy/packages/mf/FlopyModflowMf'
import FlopyModflowMfbas from 'core/model/flopy/packages/mf/FlopyModflowMfbas'

test('It can instantiate FlopyModflowMf', () => {
    const model = new FlopyModflowMf();
    const mfBas = new FlopyModflowMfbas(model);
    expect(mfBas).toBeInstanceOf(FlopyModflowMfbas);
});

test('It can be created fromObject', () => {
    const obj = {
        'extension': 'bas',
        'filenames': null,
        'hnoflo': -999.99,
        'ibound': 1,
        'ichflg': false,
        'ifrefm': true,
        'ixsec': false,
        'stoper': null,
        'strt': 1,
        'unitnumber': null,
        'enabled': true
    };

    const mfBas = FlopyModflowMfbas.fromObject(obj);
    expect(mfBas).toBeInstanceOf(FlopyModflowMfbas);
    expect(mfBas.toObject()).toEqual(obj);
});
