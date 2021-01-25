import {BoundaryCollection, ConstantHeadBoundary, WellBoundary} from '../../../../../core/model/modflow/boundaries';
import {Geometry, Stressperiods} from '../../../../../core/model/modflow';
import {IBoundary} from '../../../../../core/model/modflow/boundaries/Boundary.type';
import {ICells} from '../../../../../core/model/geometry/Cells.type';
import {LineString} from 'geojson';
import Uuid from 'uuid';

test('BoundaryCollectionFromQuery', () => {
    const query = JSON.parse('[{"type":"Feature","geometry":{"type":"Point","coordinates":[8.822021,50.31675]},"' +
        'properties":{"type":"wel","name":"Well boundary","layers":[0],"cells":[[7,2]],"well_type":"puw","sp_values":' +
        '[0]},"id":"b21336c6-f814-412f-a476-a033ca6ca570"}]');
    const boundaryCollection = BoundaryCollection.fromQuery(query);
    expect(boundaryCollection).toBeInstanceOf(BoundaryCollection);
    expect(boundaryCollection.boundaries.length).toEqual(1);
    expect(boundaryCollection.boundaries[0]).toBeInstanceOf(WellBoundary);
});

test('BoundaryCollection fromObject', () => {
    const wellObj: IBoundary = {
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
    };

    const boundaryCollection = BoundaryCollection.fromObject([wellObj]);

    expect(boundaryCollection).toBeInstanceOf(BoundaryCollection);
    expect(boundaryCollection.boundaries.length).toEqual(1);
    expect(boundaryCollection.boundaries[0]).toBeInstanceOf(WellBoundary);
    expect(boundaryCollection.boundaries[0].toObject()).toEqual(WellBoundary.fromObject(wellObj).toObject());
});

test('BoundaryCollection compareWith well', () => {

    const bc1: IBoundary[] = [{
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
    }];

    let result = BoundaryCollection.fromObject(bc1).compareWith(
        Stressperiods.fromDefaults(), BoundaryCollection.fromObject(bc1), true
    );
    expect(result).toEqual([{
        diff: {},
        id: 'b21336c6-f814-412f-a476-a033ca6ca570',
        name: 'Well Boundary',
        state: 'noUpdate',
        type: 'wel'
    }]);

    const bc2: IBoundary[] = [];
    result = BoundaryCollection.fromObject(bc1).compareWith(
        Stressperiods.fromDefaults(), BoundaryCollection.fromObject(bc2), true
    );
    expect(result).toEqual([{
        diff: {},
        id: 'b21336c6-f814-412f-a476-a033ca6ca570',
        name: 'Well Boundary',
        state: 'delete',
        type: 'wel'
    }]);

    const bc3: IBoundary[] = [{
        type: 'Feature',
        id: 'b21336c6-f814-412f-a476-a033ca6ca570',
        geometry: {
            type: 'Point',
            coordinates: [8.8220, 50.316]
        },
        properties: {
            type: 'wel',
            name: 'Well Boundary new',
            cells: [[7, 5]],
            layers: [1],
            well_type: 'iw',
            sp_values: [[1, 1, 1, 1]]
        }
    }];

    result = BoundaryCollection.fromObject(bc1).compareWith(
        Stressperiods.fromDefaults(), BoundaryCollection.fromObject(bc3), true
    );

    expect(result).toEqual([{
        diff: {
            geometry: {
                coordinates: [8.8220, 50.316]
            },
            name: 'Well Boundary new',
            cells: [[7, 5]],
            layers: [1],
            well_type: 'iw',
            sp_values: [[1, 1, 1, 1]]
        },
        id: 'b21336c6-f814-412f-a476-a033ca6ca570',
        name: 'Well Boundary new',
        state: 'update',
        type: 'wel'
    }]);

    const bc4: IBoundary[] = [
        {
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
        },
        {
            type: 'Feature',
            id: '32039f55-0d4c-40f3-836c-7aca76f9201f',
            geometry: {
                type: 'Point',
                coordinates: [8.82, 50.31]
            },
            properties: {
                type: 'wel',
                name: 'Well Boundary new',
                cells: [[7, 2]],
                layers: [0],
                well_type: 'puw',
                sp_values: [[0]]
            }
        }];

    const bc4bc = BoundaryCollection.fromObject(bc4);
    expect(bc4bc.length).toEqual(2);
    result = BoundaryCollection.fromObject(bc1).compareWith(
        Stressperiods.fromDefaults(), BoundaryCollection.fromObject(bc4), true
    );
    expect(result).toEqual([
        {
            diff: {},
            id: 'b21336c6-f814-412f-a476-a033ca6ca570',
            name: 'Well Boundary',
            state: 'noUpdate',
            type: 'wel'
        },
        {
            diff: {},
            id: '32039f55-0d4c-40f3-836c-7aca76f9201f',
            name: 'Well Boundary new',
            state: 'add',
            type: 'wel'
        }
    ]);
});

test('BoundaryCollection compareWith LineBoundary', () => {
    const id = Uuid.v4();
    const name = 'NameOfConstantHead';
    const geometry: LineString = {type: 'LineString', coordinates: [[3, 4], [3, 5], [4, 5], [4, 3], [3, 4]]};
    const layers = [1, 2];
    const cells: ICells = [[1, 2], [2, 3], [4, 5]];
    const spValues = [[1, 2], [1, 2], [1, 2]];
    const chb1 = ConstantHeadBoundary.create(id, geometry, name, layers, cells, spValues);

    const bc1 = new BoundaryCollection([chb1]);
    const bc2 = new BoundaryCollection([chb1]);

    expect(bc1.compareWith(Stressperiods.fromDefaults(), bc2, true)).toEqual([{
        diff: {},
        id,
        name: 'NameOfConstantHead',
        state: 'noUpdate',
        type: 'chd'
    }]);

    const bc3 = new BoundaryCollection();
    expect(bc1.compareWith(Stressperiods.fromDefaults(), bc3, true)).toEqual([{
        diff: {},
        id,
        name: 'NameOfConstantHead',
        state: 'delete',
        type: 'chd'
    }]);

    expect(bc3.compareWith(Stressperiods.fromDefaults(), bc1, true)).toEqual([{
        diff: {},
        id,
        name: 'NameOfConstantHead',
        state: 'add',
        type: 'chd'
    }]);

    const chb2: ConstantHeadBoundary = ConstantHeadBoundary.fromObject(chb1.toObject());
    chb2.name = 'Updated';
    chb2.geometry = Geometry.fromObject({type: 'LineString', coordinates: [[3, 4], [3, 5], [4, 5], [5, 3], [3, 4]]});

    const bc5 = new BoundaryCollection([chb2]);

    expect(bc1.compareWith(Stressperiods.fromDefaults(), bc5, true)).toEqual([{
        diff: {
            geometry: {coordinates: [[3, 4], [3, 5], [4, 5], [5, 3], [3, 4]]},
            name: 'Updated'
        },
        id,
        name: 'Updated',
        state: 'update',
        type: 'chd'
    }]);

});
