import {Soilmodel, SoilmodelLayer} from 'core/model/modflow/soilmodel';

test('Get soilmodel from object', () => {
    const soilmodel1 = Soilmodel.fromDefaults();
    expect(soilmodel1).toBeInstanceOf(Soilmodel);
    expect(Soilmodel.fromObject(null)).toBeInstanceOf(Soilmodel);
    expect(Soilmodel.fromObject(soilmodel1.toObject())).toBeInstanceOf(Soilmodel);
});

test('Setters fallback values', () => {
    const soilmodel = new Soilmodel();
    soilmodel.meta = null;
    soilmodel.general = null;
    expect(soilmodel.toObject()).toEqual({
        'general': {
            'wetfct': 0.1
        },
        'layers': [],
        'meta': {}
    });
    expect(() => {
        soilmodel.updateGeometry(null);
    }).toThrow();
});

test('Add, remove, update layer to soilmodel', () => {
    const soilmodel = new Soilmodel();
    const layer1 = new SoilmodelLayer();
    const layer2 = new SoilmodelLayer();
    soilmodel.layersCollection.add(layer1);
    soilmodel.layersCollection.add(layer2);
    expect(soilmodel.layersCollection.all).toHaveLength(2);
    layer1.name = 'Layer XYZ';
    soilmodel.layersCollection.update(layer1);
    expect(soilmodel.layersCollection.first.name).toEqual('Layer XYZ');
    soilmodel.layersCollection.remove(layer2.id);
    expect(soilmodel.layersCollection.all).toHaveLength(1);
    expect(() => {
        soilmodel.layersCollection.add(new Soilmodel());
    }).toThrow();
    expect(() => {
        soilmodel.layersCollection = null;
    }).toThrow();
});