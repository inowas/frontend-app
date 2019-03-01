import Uuid from 'uuid';
import {RiverBoundary} from 'core/model/modflow/boundaries';
import {validate} from 'services/jsonSchemaValidator';
import {JSON_SCHEMA_URL} from '../../../../../services/api';


const createRiverBoundary = () => {
    const id = Uuid.v4();
    const name = 'NameOfRRiver';
    const geometry = {type: 'LineString', coordinates: [[3, 4], [3, 5], [4, 5], [4, 3], [3, 4]]};
    const layers = [1];
    const cells = [[1, 2], [2, 3]];
    const spValues = [1, 2, 3];

    return RiverBoundary.create(
        id, geometry, name, layers, cells, spValues
    );
};

test('RiverBoundary create', () => {
    const id = Uuid.v4();
    const name = 'NameOfRRiver';
    const geometry = {type: 'LineString', coordinates: [[3, 4], [3, 5], [4, 5], [4, 3], [3, 4]]};
    const layers = [1];
    const cells = [[1, 2], [2, 3]];
    const spValues = [1, 2, 3];

    const riverBoundary = RiverBoundary.create(
        id, geometry, name, layers, cells, spValues
    );

    expect(riverBoundary).toBeInstanceOf(RiverBoundary);
    expect(riverBoundary.id).toEqual(id);
    expect(riverBoundary.name).toEqual(name);
    expect(riverBoundary.geometry).toEqual(geometry);
    expect(riverBoundary.layers).toEqual(layers);
    expect(riverBoundary.cells).toEqual(cells);
});

test('RiverBoundary add ObservationPoint', () => {
    const riverBoundary = createRiverBoundary();
    riverBoundary.addObservationPoint('Op2', {type: 'Point', coordinates: [1, 2]}, [3, 2, 1]);
    expect(riverBoundary._observationPoints).toHaveLength(2);

    const op2 = riverBoundary.findObservationPointByName('Op2');
    expect(op2).toBeTruthy();
    expect(op2.id).toBeTruthy();
    expect(op2.type).toEqual('Feature');
    expect(op2.properties.name).toEqual('Op2');
    expect(op2.geometry).toEqual({type: 'Point', coordinates: [1, 2]});
});

test('RiverBoundary clone ObservationPoint', () => {
    const riverBoundary = createRiverBoundary();
    riverBoundary.addObservationPoint('Op2', {type: 'Point', coordinates: [1, 2]}, [3, 2, 1]);
    expect(riverBoundary._observationPoints).toHaveLength(2);
    const op2 = riverBoundary.findObservationPointByName('Op2');

    const newId = Uuid.v4();
    riverBoundary.cloneObservationPoint(op2.id, newId);
    expect(riverBoundary._observationPoints).toHaveLength(3);
});

test('RiverBoundary update ObservationPoint', () => {
    const riverBoundary = createRiverBoundary();
    riverBoundary.addObservationPoint('Op2', {type: 'Point', coordinates: [1, 2]}, [3, 2, 1]);
    expect(riverBoundary._observationPoints).toHaveLength(2);
    const op2 = riverBoundary.findObservationPointByName('Op2');

    const id = op2.id;
    const geometry = {type: 'Point', coordinates: [11, 12]};
    const name = 'op2_new';
    const spValues = [3, 3, 3];

    riverBoundary.updateObservationPoint(id, name, geometry, spValues);

    const op2_new = riverBoundary.findObservationPointByName('op2_new');
    expect(op2_new).toBeTruthy();
    expect(op2_new.id).toEqual(id);
    expect(op2_new.type).toEqual('Feature');
    expect(op2_new.properties.name).toEqual(name);
    expect(op2_new.geometry).toEqual(geometry);
    expect(op2_new.properties.sp_values).toEqual(spValues);
});

test('RiverBoundary remove ObservationPoint', () => {
    const riverBoundary = createRiverBoundary();
    riverBoundary.addObservationPoint('Op2', {type: 'Point', coordinates: [1, 2]}, [3, 2, 1]);
    expect(riverBoundary._observationPoints).toHaveLength(2);
    const op2 = riverBoundary.findObservationPointByName('Op2');
    riverBoundary.removeObservationPoint(op2.id);
    expect(riverBoundary._observationPoints).toHaveLength(1);

});

test('RiverBoundary fromObject', () => {
    const obj = createRiverBoundary().toObject();
    const riverBoundary = RiverBoundary.fromObject(obj);
    expect(riverBoundary.toObject()).toEqual(obj);
});

test('RiverBoundary schema validation', () => {
    const data = createRiverBoundary().toObject();
    const schema = JSON_SCHEMA_URL + 'modflow/boundary/riverBoundary';
    validate(data, schema).then(response => expect(response)
        .toEqual([true, null]))
        .catch((error) => {
            expect(error).toEqual('');
        });
});