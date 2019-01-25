import {LayersCollection, SoilmodelLayer} from 'core/model/modflow/soilmodel';

test('From array', () => {
    const layer1 = new SoilmodelLayer();
    layer1.id = '123-456-789';
    const layer2 = new SoilmodelLayer();
    layer2.id = 'abc-def-ghi';
    const lc = LayersCollection.fromArray([layer1.toObject(), layer2.toObject()]);
    expect(lc.length).toEqual(2);
});