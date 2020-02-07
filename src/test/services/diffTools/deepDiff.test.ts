import {WellBoundary} from '../../../core/model/modflow/boundaries';
import DeepDiff from '../../../services/diffTools/deepDiff';

test('DeepDiff', () => {

    const obj1 = {
        a: 'i am unchanged',
        b: 'i am deleted',
        e: {a: 1, b: false, c: null},
        f: [1, {a: 'same', b: [{a: 'same'}, {d: 'delete'}]}],
        g: new Date('2017.11.25')
    };

    const obj2 = {
        a: 'i am unchanged',
        c: 'i am created',
        e: {a: '1', b: '', d: 'created'},
        f: [{a: 'same', b: [{a: 'same'}, {c: 'create'}]}, 1],
        g: new Date('2017.11.25')
    };

    const result = DeepDiff.map(obj1, obj2);

    expect(result).toEqual({
        a: {
            data: 'i am unchanged',
            type: 'unchanged'
        },
        b: {
            data: 'i am deleted', type: 'deleted'
        },
        c: {
            data: 'i am created', type: 'created'
        },
        e: {
            a: {data: 1, type: 'updated'},
            b: {data: false, type: 'updated'},
            c: {data: null, type: 'deleted'},
            d: {data: 'created', type: 'created'}
        },
        f: {
            0: {data: 1, type: 'updated'},
            1: {data: {a: 'same', b: [{a: 'same'}, {d: 'delete'}]}, type: 'updated'}
        },
        g: {
            data: new Date('2017.11.25'),
            type: 'unchanged'
        }
    });

    const wb1 = WellBoundary.fromObject({
        type: 'Feature',
        id: 'b21336c6-f814-412f-a476-a033ca6ca570',
        geometry: {
            type: 'Point',
            coordinates: [8.822021, 50.31675]
        },
        properties: {
            type: 'wel',
            name: 'Well Boundary',
            cells: [[7, 2]],
            layers: [0],
            well_type: 'puw',
            sp_values: [[0]]
        }
    });
    const wb2 = WellBoundary.fromObject({
        type: 'Feature',
        id: 'b21336c6-f814-412f-a476-a033ca6ca570',
        geometry: {
            type: 'Point',
            coordinates: [8.822021, 50]
        },
        properties: {
            type: 'wel',
            name: 'Well Boundary',
            cells: [[7, 2]],
            layers: [0],
            well_type: 'puw',
            sp_values: [[0]]
        }
    });

    const wbResult = DeepDiff.map(wb1, wb2);
    expect(wbResult).toEqual({
            _props: {
                geometry: {
                    coordinates: {
                        0: {data: 8.822021, type: 'unchanged'},
                        1: {data: 50.31675, type: 'updated'}
                    }, type: {data: 'Point', type: 'unchanged'}
                },
                id: {data: 'b21336c6-f814-412f-a476-a033ca6ca570', type: 'unchanged'},
                properties: {
                    cells: {0: {0: {data: 7, type: 'unchanged'}, 1: {data: 2, type: 'unchanged'}}},
                    layers: {0: {data: 0, type: 'unchanged'}},
                    name: {data: 'Well Boundary', type: 'unchanged'},
                    sp_values: {0: {0: {data: 0, type: 'unchanged'}}},
                    type: {data: 'wel', type: 'unchanged'},
                    well_type: {data: 'puw', type: 'unchanged'}
                },
                type: {data: 'Feature', type: 'unchanged'}
            }
        }
    );
});
