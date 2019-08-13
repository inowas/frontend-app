import {Point} from 'geojson';
import Uuid from 'uuid';
import {ICells} from '../../../../../core/model/geometry/Cells.type';
import {WellBoundary} from '../../../../../core/model/modflow/boundaries';
import {JSON_SCHEMA_URL} from '../../../../../services/api';
import {validate} from '../../../../../services/jsonSchemaValidator';

const createWellBoundary = () => {
    const id = Uuid.v4();
    const name = 'NameOfWell';
    const geometry: Point = {type: 'Point', coordinates: [3, 4]};
    const layers = [1];
    const cells: ICells = [[1, 2]];
    const spValues = [[1], [2], [3]];

    const wb = WellBoundary.create(id, geometry, name, layers, cells, spValues);

    wb.wellType = 'irw';
    return wb;
};

test('WellBoundary create', () => {
    const id = Uuid.v4();
    const name = 'NameOfWell';
    const geometry: Point = {type: 'Point', coordinates: [3, 4]};
    const layers = [1];
    const cells: ICells = [[1, 2]];
    const spValues = [[1], [2], [3]];

    const wellBoundary = WellBoundary.create(
        id, geometry, name, layers, cells, spValues
    );

    expect(wellBoundary).toBeInstanceOf(WellBoundary);
    expect(wellBoundary.id).toEqual(id);
    expect(wellBoundary.name).toEqual(name);
    expect(wellBoundary.geometry.toObject()).toEqual(geometry);
    expect(wellBoundary.layers).toEqual(layers);
    expect(wellBoundary.cells.toObject()).toEqual(cells);
    expect(wellBoundary.getSpValues()).toEqual(spValues);
    expect(wellBoundary.wellType).toEqual('puw');
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
