import Substance from '../../../../../core/model/modflow/transport/Substance';
import Transport from '../../../../../core/model/modflow/transport/Transport';

export default {};

test('toObject, fromObject', () => {
    const transport = {
        enabled: false,
        substances: []
    };

    expect(Transport.fromObject(transport).toObject()).toEqual(transport);
});

test('Add, update, remove Substances', () => {
    const transport = new Transport();
    const s1 = Substance.create('NaCl');
    s1.id = '1234567890';
    transport.addSubstance(s1);
    expect(transport.substances.length).toEqual(1);
    s1.boundaryConcentrations = [
        {id: 'abcdefghijklm', concentrations: [0, 100, 100, 0]},
        {id: 'nopqrstuvwxyz', concentrations: [0, 200, 200, 0]}
    ];
    transport.updateSubstance(s1);
    expect(transport.substances.first.boundaryConcentrations.length).toEqual(2);
    transport.removeSubstanceById('1234567890');
    expect(transport.substances.length).toEqual(0);
});
