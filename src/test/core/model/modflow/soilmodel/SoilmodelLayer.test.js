import {SoilmodelLayer} from '../../../core/model/modflow/soilmodel';

const layerWithoutZones = {
    'id': '123-abc-456-def',
    'name': 'Default',
    'description': 'Description',
    'number': 0,
    'laytyp': 0,
    'top': [[1, 1, 1], [1, 0, 0], [0, 0, 0]],
    'botm': 5,
    'hk': 3,
    'hani': 1,
    'vka': 2,
    'layavg': 0,
    'laywet': 0,
    'ss': 0.00002,
    'sy': 0.15
};

test('Import layer from json', () => {
    expect(SoilmodelLayer.fromObject(layerWithoutZones).toObject()._meta.zones.length).toEqual(1);

    layerWithoutZones._meta = {};
    layerWithoutZones._meta.zones = [];
    expect(SoilmodelLayer.fromObject(layerWithoutZones).toObject()._meta.zones.length).toEqual(1);
});