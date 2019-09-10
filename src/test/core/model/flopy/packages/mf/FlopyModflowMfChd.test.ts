import {LineString} from 'geojson';
import Uuid from 'uuid';
import {FlopyModflow, FlopyModflowMfchd} from '../../../../../../core/model/flopy/packages/mf';
import {IStressPeriodData} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfchd.type';
import {BoundingBox, Cells, Geometry, GridSize} from '../../../../../../core/model/geometry';
import {ConstantHeadBoundary} from '../../../../../../core/model/modflow/boundaries';

const createConstantHeadBoundary = () => {
    const id = Uuid.v4();
    const name = 'NameOfBoundary';
    const geometry = Geometry.fromGeoJson({
        type: 'LineString',
        coordinates: [[0, -4], [3, -4], [11, 0], [11, 4], [15, 2], [19, 2], [19, -2]]
    });
    const layers = [0, 2];
    const spValues = [[30, 40], [33, 44]];

    const boundingBox = new BoundingBox([[0, -5], [20, 5]]);
    const gridSize = GridSize.fromArray([10, 5]);

    const cells = Cells.fromGeometry(geometry, boundingBox, gridSize);
    const boundary = ConstantHeadBoundary.create(
        id, geometry.toObject() as LineString, name, layers, cells.toObject(), spValues
    );

    const op1 = boundary.observationPoints[0];
    boundary.updateObservationPoint(op1.id, 'OP1', {type: 'Point', coordinates: [3, -4]}, [[10, 20], [11, 22]]);
    boundary.addObservationPoint(Uuid.v4(), 'OP3', {type: 'Point', coordinates: [19, 2]}, [[30, 40], [33, 44]]);
    boundary.addObservationPoint(Uuid.v4(), 'OP2', {type: 'Point', coordinates: [11, 0]}, [[20, 30], [22, 33]]);

    cells.calculateValues(boundary, boundingBox, gridSize);
    boundary.cells = cells;

    return boundary;
};

test('It can instantiate FlopyModflowMfChd', () => {
    const model = new FlopyModflow();
    const spData: IStressPeriodData = {0: [1, 2, 4, 4, 5], 1: [1, 2, 4, 4, 5], 2: [1, 2, 4, 4, 5]};
    const mfChd = FlopyModflowMfchd.create();
    mfChd.stress_period_data = spData;
    expect(mfChd).toBeInstanceOf(FlopyModflowMfchd);
    expect(mfChd.stress_period_data).toEqual(spData);
    expect(model.getPackage('chd')).toBeInstanceOf(FlopyModflowMfchd);
    expect(model.getPackage('chd').toObject()).toEqual(mfChd.toObject());
});

test('It can calculate spData of chd-boundaries', () => {
    const spData = FlopyModflowMfchd.calculateSpData([createConstantHeadBoundary()], 2);
    expect(spData).toEqual({
            0: [
                [0, 4, 0, 10, 20], [0, 4, 1, 10, 20], [0, 4, 2, 12.049, 22.049], [0, 3, 2, 13.022, 23.022],
                [0, 3, 3, 15.009, 25.009], [0, 3, 4, 17.017, 27.017], [0, 2, 4, 18.003, 28.003], [0, 2, 5, 20, 30],
                [0, 1, 5, 21.603, 31.603], [0, 0, 5, 23.209, 33.209], [0, 0, 6, 24.647, 34.647],
                [0, 1, 6, 25.362, 35.362], [0, 1, 7, 26.793, 36.793], [0, 1, 8, 28.396, 38.396], [0, 1, 9, 30, 40],
                [0, 2, 9, 30, 40], [0, 3, 9, 30, 40], [2, 4, 0, 10, 20], [2, 4, 1, 10, 20], [2, 4, 2, 12.049, 22.049],
                [2, 3, 2, 13.022, 23.022], [2, 3, 3, 15.009, 25.009], [2, 3, 4, 17.017, 27.017],
                [2, 2, 4, 18.003, 28.003], [2, 2, 5, 20, 30], [2, 1, 5, 21.603, 31.603], [2, 0, 5, 23.209, 33.209],
                [2, 0, 6, 24.647, 34.647], [2, 1, 6, 25.362, 35.362], [2, 1, 7, 26.793, 36.793],
                [2, 1, 8, 28.396, 38.396], [2, 1, 9, 30, 40], [2, 2, 9, 30, 40], [2, 3, 9, 30, 40]
            ],
            1: [
                [0, 4, 0, 11, 22], [0, 4, 1, 11, 22], [0, 4, 2, 13.254, 24.254], [0, 3, 2, 14.324, 25.324],
                [0, 3, 3, 16.51, 27.51], [0, 3, 4, 18.719, 29.719], [0, 2, 4, 19.803, 30.803], [0, 2, 5, 22, 33],
                [0, 1, 5, 23.763, 34.763], [0, 0, 5, 25.53, 36.53], [0, 0, 6, 27.112, 38.112],
                [0, 1, 6, 27.898, 38.898], [0, 1, 7, 29.472, 40.472], [0, 1, 8, 31.236, 42.236], [0, 1, 9, 33, 44],
                [0, 2, 9, 33, 44], [0, 3, 9, 33, 44], [2, 4, 0, 11, 22], [2, 4, 1, 11, 22], [2, 4, 2, 13.254, 24.254],
                [2, 3, 2, 14.324, 25.324], [2, 3, 3, 16.51, 27.51], [2, 3, 4, 18.719, 29.719],
                [2, 2, 4, 19.803, 30.803], [2, 2, 5, 22, 33], [2, 1, 5, 23.763, 34.763], [2, 0, 5, 25.53, 36.53],
                [2, 0, 6, 27.112, 38.112], [2, 1, 6, 27.898, 38.898], [2, 1, 7, 29.472, 40.472],
                [2, 1, 8, 31.236, 42.236], [2, 1, 9, 33, 44], [2, 2, 9, 33, 44], [2, 3, 9, 33, 44]
            ]
        }
    );
});
