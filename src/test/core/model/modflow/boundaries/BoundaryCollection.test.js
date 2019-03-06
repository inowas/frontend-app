import {BoundaryCollection, WellBoundary} from 'core/model/modflow/boundaries';

test('BoundaryCollectionFromQuery', () => {
    const query = JSON.parse('[{"type":"Feature","geometry":{"type":"Point","coordinates":[8.822021,50.31675]},"properties":{"type":"wel","name":"Well boundary","layers":[0],"cells":[[7,2]],"well_type":"puw","sp_values":[0]},"id":"b21336c6-f814-412f-a476-a033ca6ca570"}]');
    const boundaryCollection = BoundaryCollection.fromQuery(query);
    expect(boundaryCollection).toBeInstanceOf(BoundaryCollection);
    expect(boundaryCollection.boundaries.length).toEqual(1);
    expect(boundaryCollection.boundaries[0]).toBeInstanceOf(WellBoundary);

});
