import {LineString, Point} from 'geojson';
import Uuid from 'uuid';
import {BoundingBox, Cells, Geometry, GridSize} from '../../../../../core/model/geometry';
import {ICells} from '../../../../../core/model/geometry/Cells.type';
import {Stressperiods} from '../../../../../core/model/modflow';
import {RiverBoundary} from '../../../../../core/model/modflow/boundaries';
import {JSON_SCHEMA_URL} from '../../../../../services/api';
import {validate} from '../../../../../services/jsonSchemaValidator';

const createRiverBoundary = () => {
    const id = Uuid.v4();
    const name = 'NameOfRRiver';
    const geometry: LineString = {type: 'LineString', coordinates: [[3, 4], [3, 5], [4, 5], [4, 3], [3, 4]]};
    const layers = [1];
    const cells: ICells = [[1, 2], [2, 3]];
    const spValues = [[1, 2, 3], [1, 2, 3], [1, 2, 3]];

    return RiverBoundary.create(id, geometry, name, layers, cells, spValues);
};

test('RiverBoundary create', () => {
    const id = Uuid.v4();
    const name = 'NameOfRRiver';
    const geometry: LineString = {type: 'LineString', coordinates: [[3, 4], [3, 5], [4, 5], [4, 3], [3, 4]]};
    const layers = [1];
    const cells: ICells = [[1, 2], [2, 3]];
    const spValues = [[1, 2, 3], [1, 2, 3], [1, 2, 3]];

    const riverBoundary = RiverBoundary.create(id, geometry, name, layers, cells, spValues);

    expect(riverBoundary).toBeInstanceOf(RiverBoundary);
    expect(riverBoundary.id).toEqual(id);
    expect(riverBoundary.name).toEqual(name);
    expect(riverBoundary.geometry.toObject()).toEqual(geometry);
    expect(riverBoundary.layers).toEqual(layers);
    expect(riverBoundary.cells.toObject()).toEqual(cells);
});

test('RiverBoundary add ObservationPoint', () => {
    const riverBoundary = createRiverBoundary();
    expect(riverBoundary.observationPoints).toHaveLength(1);

    riverBoundary.createObservationPoint(Uuid.v4(), 'Op2', {type: 'Point', coordinates: [1, 2]}, [[3], [2], [1]]);
    expect(riverBoundary.observationPoints).toHaveLength(2);

    const op2 = riverBoundary.findObservationPointByName('Op2');
    expect(op2).toBeTruthy();
    expect(op2.id).toBeTruthy();
    expect(op2.type).toEqual('op');
    expect(op2.name).toEqual('Op2');
    expect(op2.geometry).toEqual({type: 'Point', coordinates: [1, 2]});
});

test('RiverBoundary clone ObservationPoint', () => {
    const riverBoundary = createRiverBoundary();
    riverBoundary.createObservationPoint(Uuid.v4(), 'Op2', {type: 'Point', coordinates: [1, 2]}, [[3], [2], [1]]);
    expect(riverBoundary.observationPoints).toHaveLength(2);
    const op2 = riverBoundary.findObservationPointByName('Op2');

    const newId = Uuid.v4();
    riverBoundary.cloneObservationPoint(op2.id, newId, Stressperiods.fromDefaults());
    expect(riverBoundary.observationPoints).toHaveLength(3);
});

test('RiverBoundary update ObservationPoint', () => {
    const riverBoundary = createRiverBoundary();
    riverBoundary.createObservationPoint(Uuid.v4(), 'Op2', {type: 'Point', coordinates: [1, 2]}, [[3], [2], [1]]);
    expect(riverBoundary.observationPoints).toHaveLength(2);
    const op2 = riverBoundary.findObservationPointByName('Op2');

    const id = op2.id;
    const geometry: Point = {type: 'Point', coordinates: [11, 12]};
    const name = 'op2_new';
    const spValues = [[3], [3], [3]];

    riverBoundary.updateObservationPoint(id, name, geometry, spValues);

    const op2New = riverBoundary.findObservationPointByName('op2_new');
    expect(op2New).toBeTruthy();
    expect(op2New.id).toEqual(id);
    expect(op2New.type).toEqual('op');
    expect(op2New.name).toEqual(name);
    expect(op2New.geometry).toEqual(geometry);
    expect(op2New.spValues).toEqual(spValues);
});

test('RiverBoundary remove ObservationPoint', () => {
    const riverBoundary = createRiverBoundary();
    riverBoundary.createObservationPoint(Uuid.v4(), 'Op2', {type: 'Point', coordinates: [1, 2]}, [[3], [2], [1]]);
    expect(riverBoundary.observationPoints).toHaveLength(2);
    const op2 = riverBoundary.findObservationPointByName('Op2');
    riverBoundary.removeObservationPoint(op2.id);
    expect(riverBoundary.observationPoints).toHaveLength(1);

});

test('RiverBoundary fromObject', () => {
    const obj = createRiverBoundary().toObject();
    const riverBoundary = RiverBoundary.fromObject(obj);
    expect(riverBoundary.toObject()).toEqual(obj);
});

test('RiverBoundary schema validation', () => {
    const data = createRiverBoundary().toObject();
    const schema = JSON_SCHEMA_URL + '/modflow/boundary/riverBoundary';
    return expect(validate(data, schema)).resolves.toEqual([true, null]);
});

test('RiverBoundary adding ObservationPoint, orders by OPs by distance', () => {
    const id = Uuid.v4();
    const name = 'NameOfRRiver';
    const geometry = Geometry.fromGeoJson({
        type: 'LineString',
        coordinates: [[0, 5], [20, 5]]
    });
    const layers = [0];
    const spValues = [[1, 2, 3]];

    const boundingBox = new BoundingBox([[0, -5], [20, 5]]);
    const gridSize = GridSize.fromArray([10, 5]);

    const cells = Cells.fromGeometry(geometry, boundingBox, gridSize);
    expect(cells.cells.length).toBe(10);

    const riverBoundary = RiverBoundary.create(id, geometry as LineString, name, layers, cells.toObject(),
        spValues);

    const op1 = riverBoundary.observationPoints[0];
    riverBoundary.updateObservationPoint(op1.id, 'OP1', {type: 'Point', coordinates: [3, -4]}, [[10, 20, 30]]);
    riverBoundary.createObservationPoint(Uuid.v4(), 'OP3', {type: 'Point', coordinates: [19, 2]}, [[30, 40, 50]]);
    riverBoundary.createObservationPoint(Uuid.v4(), 'OP2', {type: 'Point', coordinates: [11, 0]}, [[20, 30, 40]]);

    expect(riverBoundary.observationPoints.length).toBe(3);
    expect(riverBoundary.observationPoints.filter((op) => op.name === 'OP1')).toHaveLength(1);
    expect(riverBoundary.observationPoints.filter((op) => op.name === 'OP2')).toHaveLength(1);
    expect(riverBoundary.observationPoints.filter((op) => op.name === 'OP3')).toHaveLength(1);

    riverBoundary.updateObservationPoint(op1.id, 'OP1', {type: 'Point', coordinates: [19, 1]}, [[10, 20, 30]]);

    expect(riverBoundary.observationPoints.length).toBe(3);
    expect(riverBoundary.observationPoints.filter((op) => op.name === 'OP1')).toHaveLength(1);
    expect(riverBoundary.observationPoints.filter((op) => op.name === 'OP2')).toHaveLength(1);
    expect(riverBoundary.observationPoints.filter((op) => op.name === 'OP3')).toHaveLength(1);

});

test('RiverBoundary cells calculation', () => {
    const id = Uuid.v4();
    const name = 'NameOfRRiver';
    const geometry = Geometry.fromGeoJson({
        type: 'LineString',
        coordinates: [[0, -4], [3, -4], [11, 0], [11, 4], [15, 2], [19, 2], [19, -2]]
    });
    const layers = [0];
    const spValues = [[1, 2, 3]];

    const boundingBox = new BoundingBox([[0, -5], [20, 5]]);
    const gridSize = GridSize.fromArray([10, 5]);

    const cells = Cells.fromGeometry(geometry, boundingBox, gridSize);
    expect(cells.cells.length).toBe(17);

    const riverBoundary = RiverBoundary.create(id, geometry as LineString, name, layers, cells.toObject(),
        spValues);

    const op1 = riverBoundary.observationPoints[0];
    riverBoundary.updateObservationPoint(op1.id, 'OP1', {type: 'Point', coordinates: [3, -4]}, [[10, 20, 30]]);
    riverBoundary.createObservationPoint(Uuid.v4(), 'OP3', {type: 'Point', coordinates: [19, 2]}, [[30, 40, 50]]);
    riverBoundary.createObservationPoint(Uuid.v4(), 'OP2', {type: 'Point', coordinates: [11, 0]}, [[20, 30, 40]]);

    expect(riverBoundary.observationPoints.length).toBe(3);

    cells.calculateValues(riverBoundary, boundingBox, gridSize);

    const expectedCellsRoundedValues = cells.cells.map((c) => {
        if (c[2]) {
            c[2] = Math.round(c[2] * 100) / 100;
        }
        return c;
    });

    expect(expectedCellsRoundedValues).toEqual([
        [0, 4, 0],
        [1, 4, 0],
        [2, 4, 0.20],
        [2, 3, 0.30],
        [3, 3, 0.50],
        [4, 3, 0.70],
        [4, 2, 0.80],
        [5, 2, 1],
        [5, 1, 1.16],
        [5, 0, 1.32],
        [6, 0, 1.46],
        [6, 1, 1.54],
        [7, 1, 1.68],
        [8, 1, 1.84],
        [9, 1, 2],
        [9, 2, 2],
        [9, 3, 2]],
    );
});
