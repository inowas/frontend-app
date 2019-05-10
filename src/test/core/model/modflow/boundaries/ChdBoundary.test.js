import Uuid from 'uuid';
import {ConstantHeadBoundary} from '../../../../../core/model/modflow/boundaries';
import {JSON_SCHEMA_URL} from '../../../../../services/api';
import {validate} from '../../../../../services/jsonSchemaValidator';


const createConstantHeadBoundary = () => {
    const id = Uuid.v4();
    const name = 'NameOfConstantHead';
    const geometry = {type: 'LineString', coordinates: [[3, 4], [3, 5], [4, 5], [4, 3], [3, 4]]};
    const layers = [1, 2];
    const cells = [[1, 2], [2, 3], [4, 5]];
    const spValues = [[1, 2], [1, 2], [1, 2]];

    return ConstantHeadBoundary.create(
        id, geometry, name, layers, cells, spValues
    );
};

test('ConstantHeadBoundary create', () => {
    const id = Uuid.v4();
    const name = 'NameOfConstantHead';
    const geometry = {type: 'LineString', coordinates: [[3, 4], [3, 5], [4, 5], [4, 3], [3, 4]]};
    const layers = [1, 2];
    const cells = [[1, 2], [2, 3], [4, 5]];
    const spValues = [[1, 2], [1, 2], [1, 2]];

    const constantHeadBoundary = ConstantHeadBoundary.create(
        id, geometry, name, layers, cells, spValues
    );

    expect(constantHeadBoundary).toBeInstanceOf(ConstantHeadBoundary);
    expect(constantHeadBoundary.id).toEqual(id);
    expect(constantHeadBoundary.name).toEqual(name);
    expect(constantHeadBoundary.geometry).toEqual(geometry);
    expect(constantHeadBoundary.layers).toEqual(layers);
    expect(constantHeadBoundary.cells).toEqual(cells);
});

test('ConstantHeadBoundary add ObservationPoint', () => {
    const ConstantHeadBoundary = createConstantHeadBoundary();
    ConstantHeadBoundary.addObservationPoint('Op2', {type: 'Point', coordinates: [1, 2]}, [3, 2, 1]);
    expect(ConstantHeadBoundary._observationPoints).toHaveLength(2);

    const op2 = ConstantHeadBoundary.findObservationPointByName('Op2');
    expect(op2).toBeTruthy();
    expect(op2.id).toBeTruthy();
    expect(op2.type).toEqual('Feature');
    expect(op2.properties.name).toEqual('Op2');
    expect(op2.geometry).toEqual({type: 'Point', coordinates: [1, 2]});
});

test('ConstantHeadBoundary update ObservationPoint', () => {
    const ConstantHeadBoundary = createConstantHeadBoundary();
    ConstantHeadBoundary.addObservationPoint('Op2', {type: 'Point', coordinates: [1, 2]}, [3, 2, 1]);
    expect(ConstantHeadBoundary._observationPoints).toHaveLength(2);
    const op2 = ConstantHeadBoundary.findObservationPointByName('Op2');

    const id = op2.id;
    const geometry = {type: 'Point', coordinates: [11, 12]};
    const name = 'op2_new';
    const spValues = [3, 3, 3];

    ConstantHeadBoundary.updateObservationPoint(id, name, geometry, spValues);

    const op2_new = ConstantHeadBoundary.findObservationPointByName('op2_new');
    expect(op2_new).toBeTruthy();
    expect(op2_new.id).toEqual(id);
    expect(op2_new.type).toEqual('Feature');
    expect(op2_new.properties.name).toEqual(name);
    expect(op2_new.geometry).toEqual(geometry);
    expect(op2_new.properties.sp_values).toEqual(spValues);
});

test('ConstantHeadBoundary remove ObservationPoint', () => {
    const ConstantHeadBoundary = createConstantHeadBoundary();
    ConstantHeadBoundary.addObservationPoint('Op2', {type: 'Point', coordinates: [1, 2]}, [3, 2, 1]);
    expect(ConstantHeadBoundary._observationPoints).toHaveLength(2);
    const op2 = ConstantHeadBoundary.findObservationPointByName('Op2');
    ConstantHeadBoundary.removeObservationPoint(op2.id);
    expect(ConstantHeadBoundary._observationPoints).toHaveLength(1);

});

test('ConstantHeadBoundary fromObject', () => {
    const obj = createConstantHeadBoundary().toObject();
    const constantHeadBoundary = ConstantHeadBoundary.fromObject(obj);
    expect(constantHeadBoundary.toObject()).toEqual(obj);
});

test('ConstantHeadBoundary schema validation', () => {
    const data = createConstantHeadBoundary().toObject();
    const schema = JSON_SCHEMA_URL + '/modflow/boundary/constantHeadBoundary';
    return expect(validate(data, schema)).resolves.toEqual([true, null]);
});