import Substance from '../../../../../core/model/modflow/transport/Substance';

export default {};

test('toObject, fromObject', () => {
    const substance = {
        id: '1234567890',
        name: 'NaCl',
        boundaryConcentrations: [
            {id: 'abcdefghijklm', concentrations: [0, 100, 100, 0]},
            {id: 'nopqrstuvwxyz', concentrations: [0, 200, 200, 0]}
        ]
    };

    expect(Substance.fromObject(substance).toObject()).toEqual(substance);
});

test('Add, update, remove Boundary', () => {
    const substance = Substance.create('NaCl');
    substance.addBoundaryId('abcdefghijklm');
    substance.addBoundaryId('nopqrstuvwxyz');
    expect(substance.boundaryConcentrations.length).toEqual(2);
    substance.removeBoundaryId('abcdefghijklm');
    expect(substance.boundaryConcentrations.length).toEqual(1);
    substance.updateConcentrations('nopqrstuvwxyz', [100, 200, 300, 300]);
    expect(substance.boundaryConcentrations[0].concentrations.length).toEqual(4);
});
