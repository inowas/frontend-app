import {EMethodType, ETimeResolution, IRtModelling} from '../../../core/model/rtm/modelling/RTModelling.type';
import {appendBoundaryData} from '../../../scenes/t20/components/appendBoundaryData';
import RTModelling from '../../../core/model/rtm/modelling/RTModelling';

const startDate = (new Date(Date.now() - (1000 * 60 * 60 * 24 * 6))).toString();

const rtm: IRtModelling = {
    'id': '44f71f90-ed79-4af6-a674-9d410c37e093',
    'name': 'Helgoland RTM',
    'description': 'This is just a test!',
    'permissions': 'rwx',
    'public': true,
    'tool': 'T20',
    'data': {
        'model_id': 'fe1426b1-62c6-4f71-95ba-87f82fe6806f',
        'automatic_calculation': true,
        'simulated_times': [],
        'start_date_time': startDate,
        'time_resolution': ETimeResolution.DAILY,
        'head': [{
            'boundary_id': '08e899c6-93c9-4e09-9bb9-8173b8cc93bb',
            'data': {
                '243e0522-5e29-4d97-932b-2e608b0d50d6': [
                    {
                        'method': EMethodType.SENSOR,
                        'values': [20.0, 19.1, 19.0, 19.4, 20.5],
                        'monitoring_id': '9dbc2c19-1ec6-423f-be8b-a998af3c9119',
                        'sensor_id': '1d99051a-a04e-4b65-822d-e62023a4e9ae',
                        'parameter_id': '686314e5-283c-4130-983a-8579b99614a9'
                    },
                    {
                        'method': EMethodType.CONSTANT,
                        'values': null
                    }
                ]
            }
        }, {
            'boundary_id': '7efa8f1f-ddb9-46c6-a0e0-a0cba298b66f',
            'data': {
                '990237b2-b293-46c0-abfc-c1e4d008fbee': [
                    {
                        'method': EMethodType.CONSTANT,
                        'values': null
                    },
                    {
                        'method': EMethodType.CONSTANT,
                        'values': null
                    }
                ],
                'edb8b5c3-577e-4119-a3a1-897aeff06405': [
                    {
                        'method': EMethodType.FUNCTION,
                        'values': [3, 5, 7, 9, 11],
                        'function': '2x + 1'
                    },
                    {
                        'method': EMethodType.CONSTANT,
                        'values': null
                    }
                ]
            }
        }, {
            'boundary_id': '2f614d5a-91c2-4b54-9141-0a83b383321d',
            'data': [
                {
                    'method': EMethodType.CONSTANT,
                    'values': null
                },
                {
                    'method': EMethodType.FUNCTION,
                    'function': 'func3',
                    'values': [1, 2, 3, 4, 5]
                },
                {
                    'method': EMethodType.FUNCTION,
                    'function': 'func4',
                    'values': [6, 7, 8, 9, 10]
                }
            ]
        }]
    }
};

test('Append boundary data', async () => {
    expect(await appendBoundaryData(RTModelling.fromObject(rtm))).toEqual({
        'stressperiods': {
            'times': [1, 2, 3, 4, 5]
        },
        'boundaries': {
            'spValues': {
                '08e899c6-93c9-4e09-9bb9-8173b8cc93bb': {
                    '243e0522-5e29-4d97-932b-2e608b0d50d6': [
                        [20.0, null],
                        [19.1, null],
                        [19.0, null],
                        [19.4, null],
                        [20.5, null]
                    ]
                },
                '7efa8f1f-ddb9-46c6-a0e0-a0cba298b66f': {
                    'edb8b5c3-577e-4119-a3a1-897aeff06405': [
                        [3, null],
                        [5, null],
                        [7, null],
                        [9, null],
                        [11, null]
                    ],
                },
                '2f614d5a-91c2-4b54-9141-0a83b383321d': [
                    [null, 1, 6],
                    [null, 2, 7],
                    [null, 3, 8],
                    [null, 4, 9],
                    [null, 5, 10]
                ]
            }
        }
    });
});

