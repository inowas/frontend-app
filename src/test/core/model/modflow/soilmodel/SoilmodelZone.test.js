import {SoilmodelZone} from 'core/model/modflow/soilmodel';
import {defaultParameters} from 'scenes/t03/defaults/soilmodel';

const exampleZone = {
    'id': 'abc-123-def-456',
    'name': 'Zone 1',
    'geometry': {
        'type': 'Polygon',
        'coordinates': [
            [-63.687336, -31.313615],
            [-63.687336, -31.367449],
            [-63.56926, -31.367449],
            [-63.56926, -31.313615],
            [-63.687336, -31.313615]
        ]
    },
    'activeCells': [[0, 10], [1, 10], [2, 10], [3, 10], [0, 9], [1, 9], [2, 9], [3, 9], [4, 9], [5, 9]],
    'priority': 1,
    'top': defaultParameters.top,
    'botm': defaultParameters.botm,
    'hk': defaultParameters.hk,
    'hani': defaultParameters.hani,
    'vka': defaultParameters.vka,
    'ss': defaultParameters.ss,
    'sy': defaultParameters.sy
};

test('Get soilmodel zone from object and from default', () => {
    const zone1 = SoilmodelZone.fromObject(exampleZone);
    expect(zone1).toBeInstanceOf(SoilmodelZone);
    expect(zone1.toObject()).toEqual(exampleZone);
    const zone2 = SoilmodelZone.fromObject(null);
    expect(zone2).toBeInstanceOf(SoilmodelZone);
});