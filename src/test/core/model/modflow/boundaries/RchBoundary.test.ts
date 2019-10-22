import {Polygon} from 'geojson';
import Uuid from 'uuid';
import {ICells} from '../../../../../core/model/geometry/Cells.type';
import {RechargeBoundary} from '../../../../../core/model/modflow/boundaries';
import {JSON_SCHEMA_URL} from '../../../../../services/api';
import {validate} from '../../../../../services/jsonSchemaValidator';

const createRechargeBoundary = () => {
    const id = Uuid.v4();
    const name = 'NameOfRecharge';
    const geometry: Polygon = {type: 'Polygon', coordinates: [[[3, 4], [3, 5], [4, 5], [4, 3], [3, 4]]]};
    const layers = [1];
    const cells: ICells = [[1, 2], [2, 3]];
    const spValues = [[1], [1], [1]];

    return RechargeBoundary.create(id, geometry, name, layers, cells, spValues, 1);
};

test('RechargeBoundary create', () => {
    const id = Uuid.v4();
    const name = 'NameOfRecharge';
    const geometry: Polygon = {type: 'Polygon', coordinates: [[[3, 4], [3, 5], [4, 5], [4, 3], [3, 4]]]};
    const layers = [1];
    const cells: ICells = [[1, 2], [2, 3]];
    const spValues = [[1], [1], [1]];

    const rechargeBoundary = RechargeBoundary.create(id, geometry, name, layers, cells, spValues, 1);

    expect(rechargeBoundary).toBeInstanceOf(RechargeBoundary);
    expect(rechargeBoundary.id).toEqual(id);
    expect(rechargeBoundary.name).toEqual(name);
    expect(rechargeBoundary.geometry.toObject()).toEqual(geometry);
    expect(rechargeBoundary.layers).toEqual(layers);
    expect(rechargeBoundary.cells.toObject()).toEqual(cells);
    expect(rechargeBoundary.getSpValues()).toEqual(spValues);
});

test('RechargeBoundary fromObject', () => {
    const obj = createRechargeBoundary().toObject();
    const rechargeBoundary = RechargeBoundary.fromObject(obj);
    expect(rechargeBoundary.toObject()).toEqual(obj);
});

test('RechargeBoundary schema validation', () => {
    const data = createRechargeBoundary().toObject();
    const schema = JSON_SCHEMA_URL + '/modflow/boundary/rechargeBoundary';
    return expect(validate(data, schema)).resolves.toEqual([true, null]);
});
