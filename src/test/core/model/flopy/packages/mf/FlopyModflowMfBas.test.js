import {FlopyModflowMfbas} from '../../../../../../core/model/flopy/packages/mf';

test('It can instantiate FlopyModflowMfbas from default', () => {
    const mfBas = FlopyModflowMfbas.fromDefault();
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
        'unitnumber': null
    };

    const mfBas = FlopyModflowMfbas.fromObject(obj);
    expect(mfBas).toBeInstanceOf(FlopyModflowMfbas);
    expect(mfBas.toObject()).toEqual(obj);
});
