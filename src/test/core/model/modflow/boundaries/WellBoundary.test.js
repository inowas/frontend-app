import Uuid from 'uuid';
import {WellBoundary} from 'core/model/modflow/boundaries';
import {validate} from 'services/jsonSchemaValidator'
import {JSON_SCHEMA_URL} from 'services/api';


const createWellBoundary = () => {
    const id = Uuid.v4();
    const name = 'NameOfWell';
    const geometry = {type: 'Point', coordinates: [3, 4]};
    const layers = [1];
    const cells = [[1, 2]];
    const spValues = [[1], [2], [3]];

    const wb = WellBoundary.create(
        id, geometry, name, layers, cells, spValues
    );

    wb.wellType = 'irw';
    return wb;
};

test('WellBoundary create', () => {
    const id = Uuid.v4();
    const name = 'NameOfWell';
    const geometry = {type: 'Point', coordinates: [[3, 4]]};
    const layers = [1];
    const cells = [[1, 2]];
    const spValues = [[1], [2], [3]];

    const wellBoundary = WellBoundary.create(
        id, geometry, name, layers, cells, spValues
    );

    expect(wellBoundary).toBeInstanceOf(WellBoundary);
    expect(wellBoundary.id).toEqual(id);
    expect(wellBoundary.name).toEqual(name);
    expect(wellBoundary.geometry).toEqual(geometry);
    expect(wellBoundary.layers).toEqual(layers);
    expect(wellBoundary.cells).toEqual(cells);
    expect(wellBoundary.spValues).toEqual(spValues);
    expect(wellBoundary.wellType).toEqual('puw');
});

test('WellBoundary getter and setter', () => {
    const boundary = new WellBoundary();
    boundary.id = 1;
    expect(boundary.id).toEqual(1);
});


test('WellBoundary fromObject', () => {
    const obj = createWellBoundary().toObject();

    const wellBoundary = WellBoundary.fromObject(obj);
    expect(wellBoundary.toObject()).toEqual(obj);
});

test('WellBoundary schema validation', () => {
    const data = createWellBoundary().toObject();
    const schema = JSON_SCHEMA_URL + '/modflow/boundary/wellBoundary';
    return expect(validate(data, schema)).resolves.toEqual([true, null]);
});