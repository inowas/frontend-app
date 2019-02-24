import Uuid from 'uuid';
import {RiverBoundary} from 'core/model/modflow/boundaries';


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


test('RiverBoundary fromObject', () => {
    const obj = createRiverBoundary().toObject();
    const riverBoundary = RiverBoundary.fromObject(obj);
    expect(riverBoundary.toObject()).toEqual(obj);
});