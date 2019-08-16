import {Polygon} from 'geojson';
import {Geometry, GridSize} from '../../../../../core/model/geometry';
import BoundingBox from '../../../../../core/model/geometry/BoundingBox';
import {Soilmodel} from '../../../../../core/model/modflow';
import {calculateActiveCells} from '../../../../../services/geoTools';
import {eSoilmodel, eSoilmodelLegacy} from './examples';

const boundingBox = new BoundingBox([[17.07494, 50.023623], [18.687221, 50.759482]]);
const geometry = new Geometry({
    type: 'Polygon',
    coordinates: [[[17.217513, 50.759482], [17.07494, 50.103185], [18.651126, 50.022437], [18.638707, 50.742484],
        [17.217513, 50.759482]]]
});
const gridSize = new GridSize(10, 10);
const cells = calculateActiveCells(geometry, boundingBox, gridSize);

test('Create Soilmodel from Default', () => {
    const soilmodel = Soilmodel.fromDefaults(geometry, cells);
    expect(soilmodel.parametersCollection.length).toEqual(7);
    expect(soilmodel.relationsCollection.length).toEqual(7);
});

test('Legacy support', () => {
    const query = Soilmodel.fromQuery(eSoilmodelLegacy).toObject();
    const expected = eSoilmodel;

    expect(query.layers).toEqual(expected.layers);
    expect(query.properties.zones).toEqual(expected.properties.zones);
    expect(query.properties.parameters).toEqual(expected.properties.parameters);
    expect(query.properties.relations.length).toEqual(8);
    expect(query.properties.relations[7].value).toEqual(0);
});
