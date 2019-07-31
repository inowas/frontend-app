import {LineString, Point} from 'geojson';
import Uuid from 'uuid';
import {Cell} from '../../../../../core/model/geometry/types';
import {GeneralHeadBoundary} from '../../../../../core/model/modflow/boundaries';
import {JSON_SCHEMA_URL} from '../../../../../services/api';
import {validate} from '../../../../../services/jsonSchemaValidator';

const createGeneralHeadBoundary = () => {
    const id = Uuid.v4();
    const name = 'NameOfGeneralHead';
    const geometry: LineString = {type: 'LineString', coordinates: [[3, 4], [3, 5], [4, 5], [4, 3], [3, 4]]};
    const layers = [1, 2];
    const cells: Cell[] = [[1, 2], [2, 3], [4, 5]];
    const spValues = [[1, 2], [1, 2], [1, 2]];

    return GeneralHeadBoundary.create(
        id, 'ghb', geometry, name, layers, cells, spValues
    );
};

test('GeneralHeadBoundary create', () => {
    const id = Uuid.v4();
    const name = 'NameOfGeneralHead';
    const geometry: LineString = {type: 'LineString', coordinates: [[3, 4], [3, 5], [4, 5], [4, 3], [3, 4]]};
    const layers = [1, 2];
    const cells: Cell[] = [[1, 2], [2, 3], [4, 5]];
    const spValues = [[1, 2], [1, 2], [1, 2]];

    const generalHeadBoundary = GeneralHeadBoundary.create(
        id, 'ghb', geometry, name, layers, cells, spValues
    );

    expect(generalHeadBoundary).toBeInstanceOf(GeneralHeadBoundary);
    expect(generalHeadBoundary.id).toEqual(id);
    expect(generalHeadBoundary.name).toEqual(name);
    expect(generalHeadBoundary.geometry).toEqual(geometry);
    expect(generalHeadBoundary.layers).toEqual(layers);
    expect(generalHeadBoundary.cells).toEqual(cells);
});

test('GeneralHeadBoundary add ObservationPoint', () => {
    const generalHeadBoundary = createGeneralHeadBoundary();
    generalHeadBoundary.addObservationPoint('Op2', {type: 'Point', coordinates: [1, 2]}, [[3], [2], [1]]);
    expect(generalHeadBoundary.observationPoints).toHaveLength(2);

    const op2 = generalHeadBoundary.findObservationPointByName('Op2');
    expect(op2).toBeTruthy();
    expect(op2.id).toBeTruthy();
    expect(op2.type).toEqual('Feature');
    expect(op2.properties.name).toEqual('Op2');
    expect(op2.geometry).toEqual({type: 'Point', coordinates: [1, 2]});
});

test('GeneralHeadBoundary update ObservationPoint', () => {
    const generalHeadBoundary = createGeneralHeadBoundary();
    generalHeadBoundary.addObservationPoint('Op2', {type: 'Point', coordinates: [1, 2]}, [[3], [2], [1]]);
    expect(generalHeadBoundary.observationPoints).toHaveLength(2);
    const op2 = generalHeadBoundary.findObservationPointByName('Op2');

    const id = op2.id;
    const geometry: Point = {type: 'Point', coordinates: [11, 12]};
    const name = 'op2_new';
    const spValues = [[3], [3], [3]];

    generalHeadBoundary.updateObservationPoint(id, name, geometry, spValues);

    const op2New = generalHeadBoundary.findObservationPointByName('op2_new');
    expect(op2New).toBeTruthy();
    expect(op2New.id).toEqual(id);
    expect(op2New.type).toEqual('Feature');
    expect(op2New.properties.name).toEqual(name);
    expect(op2New.geometry).toEqual(geometry);
    expect(op2New.properties.sp_values).toEqual(spValues);
});

test('GeneralHeadBoundary remove ObservationPoint', () => {
    const generalHeadBoundary = createGeneralHeadBoundary();
    generalHeadBoundary.addObservationPoint('Op2', {type: 'Point', coordinates: [1, 2]}, [[3], [2], [1]]);
    expect(generalHeadBoundary.observationPoints).toHaveLength(2);
    const op2 = generalHeadBoundary.findObservationPointByName('Op2');
    generalHeadBoundary.removeObservationPoint(op2.id);
    expect(generalHeadBoundary.observationPoints).toHaveLength(1);

});

test('GeneralHeadBoundary fromObject', () => {
    const obj = createGeneralHeadBoundary().toObject();
    const generalHeadBoundary = GeneralHeadBoundary.fromObject(obj);
    expect(generalHeadBoundary.toObject()).toEqual(obj);
});

test('GeneralHeadBoundary schema validation', () => {
    const data = createGeneralHeadBoundary().toObject();
    const schema = JSON_SCHEMA_URL + '/modflow/boundary/generalHeadBoundary';
    return expect(validate(data, schema)).resolves.toEqual([true, null]);
});