import {BoundaryCollection, ModflowModel} from '../../../core/model/modflow';
import {EMethodType, ETimeResolution, IRtModelling} from '../../../core/model/rtm/modelling/RTModelling.type';
import {IBoundary} from '../../../core/model/modflow/boundaries/Boundary.type';
import {IModflowModel} from '../../../core/model/modflow/ModflowModel.type';
import {appendBoundaryData} from '../../../scenes/t20/components/appendBoundaryData';
import RTModelling from '../../../core/model/rtm/modelling/RTModelling';

const dateMinusDays = (days: number) => {
    return new Date(Math.floor(Date.now() - (1000 * 60 * 60 * 24 * days))).toISOString();
}

const boundaries: IBoundary[] = [{
    'type': 'FeatureCollection',
    'features': [{
        'type': 'Feature',
        'geometry': {
            'type': 'LineString',
            'coordinates': []
        },
        'properties': {
            'type': 'chd',
            'name': 'CHD',
            'layers': [0],
            'cells': []
        },
        'id': '08e899c6-93c9-4e09-9bb9-8173b8cc93bb'
    }, {
        'type': 'Feature',
        'geometry': {'type': 'Point', 'coordinates': [7.883506, 54.183721]},
        'properties': {'name': 'OP1', 'sp_values': [[125, 125]], 'type': 'op', 'distance': 0},
        'id': '243e0522-5e29-4d97-932b-2e608b0d50d6'
    }]
}, {
    'type': 'FeatureCollection', 'features': [{
        'type': 'Feature',
        'geometry': {
            'type': 'LineString',
            'coordinates': []
        },
        'properties': {
            'type': 'chd',
            'name': 'Sea',
            'layers': [0],
            'cells': []
        },
        'id': '7efa8f1f-ddb9-46c6-a0e0-a0cba298b66f'
    }, {
        'type': 'Feature',
        'geometry': {'type': 'Point', 'coordinates': [7.869773, 54.18804]},
        'properties': {'name': 'OP1', 'sp_values': [[0, 0]], 'type': 'op', 'distance': 0},
        'id': '990237b2-b293-46c0-abfc-c1e4d008fbee'
    }]
}];

const model: IModflowModel = {
    'id': '8227c23a-de89-4d3b-a347-ef4d01a0e38d',
    'name': 'Helgoland',
    'description': 'Here you can say a bit more about the project',
    'permissions': 'r--',
    'public': true,
    'discretization': {
        'geometry': {
            'type': 'Polygon',
            'coordinates': []
        },
        'bounding_box': [[7.869108683919706, 54.1725983643623], [7.894309368734003, 54.189019017405236]],
        'grid_size': {'n_x': 50, 'n_y': 50},
        'cells': [],
        'stressperiods': {
            'start_date_time': '2000-01-01T00:00:00.000Z',
            'end_date_time': '2019-12-31T00:00:00.000Z',
            'time_unit': 4,
            'stressperiods': [{'start_date_time': '2000-01-01T00:00:00.000Z', 'nstp': 1, 'tsmult': 1, 'steady': true}]
        },
        'length_unit': 2,
        'time_unit': 4,
        'rotation': 0,
        'intersection': 0
    },
    'calculation_id': '081f36279bbe39b304a46e09d939d5cf'
}

const rtm: IRtModelling = {
    'id': '01cc984e-8c43-4a24-be22-f6608ca3c20f',
    'name': 'Helgoland RTM 2',
    'description': '',
    'permissions': 'rwx',
    'public': true,
    'tool': 'T20',
    'data': {
        'model_id': '8227c23a-de89-4d3b-a347-ef4d01a0e38d',
        'automatic_calculation': true,
        'simulated_times': [],
        'start_date_time': dateMinusDays(6),
        'time_resolution': ETimeResolution.DAILY,
        'head': [{
            'boundary_id': '08e899c6-93c9-4e09-9bb9-8173b8cc93bb', 'data': {
                '243e0522-5e29-4d97-932b-2e608b0d50d6': [{
                    'method': EMethodType.SENSOR,
                    'values': [8.5125, 4.2129, 1.7062, 7.3217, 6.58, 3.2404],
                    'monitoring_id': '83ee6f70-8239-4b65-ae09-91dc65f65fc7',
                    'sensor_id': 'cad8dfc6-b642-4dd5-a09f-e40fbaf1faec',
                    'parameter_id': '5ac99fc4-43d7-4182-8429-1adeec12bf8e'
                }, {
                    'method': EMethodType.SENSOR,
                    'values': [3.95, 3.91, 3.9, 3.9, 3.88, 3.85],
                    'monitoring_id': '7310b35b-f7ee-4768-b335-f46311f1b24d',
                    'sensor_id': '5505cd57-c18e-4725-9fb6-d541f8edd8b2',
                    'parameter_id': 'e0237eaf-e0b4-4802-a54b-c72210f926cd'
                }]
            }
        }, {
            'boundary_id': '7efa8f1f-ddb9-46c6-a0e0-a0cba298b66f', 'data': {
                '990237b2-b293-46c0-abfc-c1e4d008fbee': [
                    {
                        'method': EMethodType.CONSTANT,
                        'values': null
                    },
                    {
                        'method': EMethodType.SENSOR,
                        'values': [0.384, 0.383, 0.382, 0.383, 0.383, 0.383],
                        'monitoring_id': '65faecdd-aa1c-4f10-bfc1-cff5074f2f34',
                        'sensor_id': 'fe7daf19-c462-42a6-ade3-ec2fbbc8f6d7',
                        'parameter_id': 'f241139e-5f9c-48fa-8d6e-9716e8abca43'
                    }
                ]
            }
        }]
    }
}

test('Append data', () => {
    const result = appendBoundaryData(
        BoundaryCollection.fromObject(boundaries),
        ModflowModel.fromObject(model),
        RTModelling.fromObject(rtm)
    );

    if (!result) {
        return null;
    }

    expect(result.boundaries).toEqual([{
        'type': 'FeatureCollection',
        'features': [{
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'coordinates': []
            },
            'properties': {
                'type': 'chd',
                'name': 'CHD',
                'layers': [0],
                'cells': []
            },
            'id': '08e899c6-93c9-4e09-9bb9-8173b8cc93bb'
        }, {
            'type': 'Feature', 'geometry': {'type': 'Point', 'coordinates': [7.883506, 54.183721]}, 'properties': {
                'name': 'OP1',
                'sp_values': [
                    [125, 125], [8.5125, 3.95], [4.2129, 3.91], [1.7062, 3.9], [7.3217, 3.9],
                    [6.58, 3.88], [3.2404, 3.85]
                ],
                'type': 'op',
                'distance': 0
            }, 'id': '243e0522-5e29-4d97-932b-2e608b0d50d6'
        }]
    }, {
        'type': 'FeatureCollection', 'features': [{
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'coordinates': []
            },
            'properties': {
                'type': 'chd',
                'name': 'Sea',
                'layers': [0],
                'cells': []
            },
            'id': '7efa8f1f-ddb9-46c6-a0e0-a0cba298b66f'
        }, {
            'type': 'Feature', 'geometry': {'type': 'Point', 'coordinates': [7.869773, 54.18804]}, 'properties': {
                'name': 'OP1',
                'sp_values': [
                    [0, 0], [0, 0.384], [0, 0.383], [0, 0.382], [0, 0.383], [0, 0.383], [0, 0.383]
                ],
                'type': 'op',
                'distance': 0
            }, 'id': '990237b2-b293-46c0-abfc-c1e4d008fbee'
        }]
    }]);

    expect(result.stressperiods.stressperiods).toHaveLength(7);
});

