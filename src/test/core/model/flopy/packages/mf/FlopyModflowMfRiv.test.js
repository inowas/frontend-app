import Uuid from 'uuid';
import {RiverBoundary} from '../../../../../../core/model/modflow/boundaries';
import {BoundingBox, Cells, Geometry, GridSize} from '../../../../../../core/model/geometry';
import {FlopyModflow, FlopyModflowMfriv} from '../../../../../../core/model/flopy/packages/mf';

const createRiverBoundary = () => {
    const id = Uuid.v4();
    const name = 'NameOfRRiver';
    const geometry = Geometry.fromGeoJson({
        type: 'LineString',
        coordinates: [[0, -4], [3, -4], [11, 0], [11, 4], [15, 2], [19, 2], [19, -2]]
    });
    const layers = [0];
    const spValues = [[30, 40, 50], [33, 44, 55]];

    const boundingBox = new BoundingBox(0, 20, -5, 5);
    const gridSize = new GridSize(10, 5);

    const cells = Cells.fromGeometry(geometry, boundingBox, gridSize);
    const riverBoundary = RiverBoundary.create(id, 'riv', geometry, name, layers, cells, spValues);

    const op1 = riverBoundary.observationPoints[0];
    riverBoundary.updateObservationPoint(op1.id, 'OP1', {
        'type': 'Point',
        coordinates: [3, -4]
    }, [[10, 20, 30], [11, 22, 33]]);
    riverBoundary.addObservationPoint('OP3', {'type': 'Point', coordinates: [19, 2]}, [[30, 40, 50], [33, 44, 55]]);
    riverBoundary.addObservationPoint('OP2', {'type': 'Point', coordinates: [11, 0]}, [[20, 30, 40], [22, 33, 44]]);

    cells.calculateValues(riverBoundary, boundingBox, gridSize);

    riverBoundary.cells = cells.cells;

    return riverBoundary;
};

test('It can instantiate FlopyModflowMfRiv', () => {
    const model = new FlopyModflow();
    const spData = {'0': [1, 2, 4, 4, 5, 5], '1': [1, 2, 4, 4, 5, 5], '2': [1, 2, 4, 4, 5, 5]};
    const mfRiv = FlopyModflowMfriv.create(model, {stress_period_data: spData});
    expect(mfRiv).toBeInstanceOf(FlopyModflowMfriv);
    expect(mfRiv.stress_period_data).toEqual(spData);
    expect(model.getPackage('riv')).toBeInstanceOf(FlopyModflowMfriv);
    expect(model.getPackage('riv').toObject()).toEqual(mfRiv.toObject())
});

test('It can calculate spData river boundaries', () => {
    const spData = FlopyModflowMfriv.calculateSpData([createRiverBoundary()], 2);
    expect(spData).toEqual({
            '0': [
                [0, 4, 0, 10, 20, 30], [0, 4, 1, 10, 20, 30], [0, 4, 2, 12.049, 22.049, 32.049],
                [0, 3, 2, 13.022, 23.022, 33.022], [0, 3, 3, 15.009, 25.009, 35.009], [0, 3, 4, 17.017, 27.017, 37.017],
                [0, 2, 4, 18.003, 28.003, 38.003], [0, 2, 5, 20, 30, 40], [0, 1, 5, 21.603, 31.603, 41.603],
                [0, 0, 5, 23.209, 33.209, 43.209], [0, 0, 6, 24.647, 34.647, 44.647], [0, 1, 6, 25.362, 35.362, 45.362],
                [0, 1, 7, 26.793, 36.793, 46.793], [0, 1, 8, 28.396, 38.396, 48.396], [0, 1, 9, 30, 40, 50],
                [0, 2, 9, 30, 40, 50], [0, 3, 9, 30, 40, 50]
            ],
            '1': [
                [0, 4, 0, 11, 22, 33], [0, 4, 1, 11, 22, 33], [0, 4, 2, 13.254, 24.254, 35.254],
                [0, 3, 2, 14.324, 25.324, 36.324], [0, 3, 3, 16.51, 27.51, 38.51], [0, 3, 4, 18.719, 29.719, 40.719],
                [0, 2, 4, 19.803, 30.803, 41.803], [0, 2, 5, 22, 33, 44], [0, 1, 5, 23.763, 34.763, 45.763],
                [0, 0, 5, 25.53, 36.53, 47.53], [0, 0, 6, 27.112, 38.112, 49.112], [0, 1, 6, 27.898, 38.898, 49.898],
                [0, 1, 7, 29.472, 40.472, 51.472], [0, 1, 8, 31.236, 42.236, 53.236], [0, 1, 9, 33, 44, 55],
                [0, 2, 9, 33, 44, 55], [0, 3, 9, 33, 44, 55]
            ]
        }
    );
});
