import {Point} from 'geojson';
import Uuid from 'uuid';
import {Geometry} from '../../../../../core/model/geometry';
import {ICells} from '../../../../../core/model/geometry/Cells.type';
import {Cells} from '../../../../../core/model/modflow';
import {HeadObservationWell} from '../../../../../core/model/modflow/boundaries';
import {JSON_SCHEMA_URL} from '../../../../../services/api';
import {validate} from '../../../../../services/jsonSchemaValidator';

const createHeadObservationWell = () => {
    const id = Uuid.v4();
    const name = 'NameOfWell';
    const geometry: Point = {type: 'Point', coordinates: [3, 4]};
    const layers = [1];
    const cells: ICells = [[1, 2]];
    const spValues = [[1], [2], [3]];

    return HeadObservationWell.create(id, geometry, name, layers, cells, spValues);
};

test('HeadObservationWell create', () => {
    const id = Uuid.v4();
    const name = 'NameOfWell';
    const geometry: Point = {type: 'Point', coordinates: [3, 4]};
    const layers = [1];
    const cells: ICells = [[1, 2]];
    const spValues = [[1], [2], [3]];

    const headObservationWell = HeadObservationWell.create(id, geometry, name, layers, cells, spValues);

    expect(headObservationWell).toBeInstanceOf(HeadObservationWell);
    expect(headObservationWell.id).toEqual(id);
    expect(headObservationWell.name).toEqual(name);
    expect(headObservationWell.geometry).toBeInstanceOf(Geometry);
    expect(headObservationWell.geometry.toObject()).toEqual(geometry);
    expect(headObservationWell.layers).toEqual(layers);
    expect(headObservationWell.cells).toBeInstanceOf(Cells);
    expect(headObservationWell.cells.toObject()).toEqual(cells);
    expect(headObservationWell.getSpValues()).toEqual(spValues);
});

test('HeadObservationWell fromObject', () => {
    const obj = createHeadObservationWell().toObject();
    const headObservationWell = HeadObservationWell.fromObject(obj);
    expect(headObservationWell.toObject()).toEqual(obj);
});

test('HeadObservationWell schema validation', () => {
    const data = createHeadObservationWell().toObject();
    const schema = JSON_SCHEMA_URL + '/modflow/boundary/headObservationWell';
    return expect(validate(data, schema)).resolves.toEqual([true, null]);
});
