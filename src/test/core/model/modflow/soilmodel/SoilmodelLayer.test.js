import {SoilmodelLayer, SoilmodelZone} from 'core/model/modflow/soilmodel';
import Geometry from 'core/model/modflow/Geometry';
import ActiveCells from 'core/model/modflow/ActiveCells';
import GridSize from 'core/model/modflow/GridSize';
import {defaultParameters} from 'scenes/t03/defaults/soilmodel';

const geometry = new Geometry({
    'type': 'Polygon',
    'coordinates': [
        [[30, 10], [40, 40], [20, 40], [10, 20], [30, 10]]
    ]
});
const activeCells = ActiveCells.create();

test('Get soilmodel layer from object and defaults', () => {
    const layer1 = SoilmodelLayer.fromDefault(geometry, activeCells);
    expect(layer1).toBeInstanceOf(SoilmodelLayer);
    expect(() => {
        SoilmodelLayer.fromDefault(null, null);
    }).toThrow();
    expect(() => {
        SoilmodelLayer.fromDefault(new Geometry(), null);
    }).toThrow();
});

test('Add, remove, update zone to layer', () => {
    const layer1 = SoilmodelLayer.fromDefault(geometry, activeCells);
    const zone1 = SoilmodelZone.fromDefault();
    const zone2 = SoilmodelZone.fromDefault();
    layer1.zonesCollection.add(zone1);
    layer1.zonesCollection.update(zone2);
    expect(layer1.zonesCollection.all).toHaveLength(3);
    zone1.name = 'Zone XYZ';
    layer1.zonesCollection.update(zone1);
    expect(layer1.zonesCollection.all[1].name).toEqual('Zone XYZ');
    layer1.zonesCollection.remove(zone2.id);
    expect(layer1.zonesCollection.all).toHaveLength(2);
    expect(() => {
        layer1.zonesCollection.add({});
    }).toThrow();
});

test('Setters fallback values', () => {
    const layer1 = SoilmodelLayer.fromDefault(geometry, activeCells);
    layer1.id = 'c333ac03-a830-4005-83ab-77bb2286640f';
    layer1.name = null;
    layer1.number = null;
    layer1.description = null;
    layer1.meta = null;
    layer1.laytyp = null;
    expect(layer1.toObject()).toEqual({
        'botm': defaultParameters.botm.defaultValue,
        'description': '',
        'hani': defaultParameters.hani.defaultValue,
        'hk': defaultParameters.hk.defaultValue,
        'id': 'c333ac03-a830-4005-83ab-77bb2286640f',
        'layavg': 0,
        'laytyp': 0,
        'laywet': 0,
        '_meta': {
            'zones': []
        },
        'name': 'New Layer',
        'number': 0,
        'ss': defaultParameters.ss.defaultValue,
        'sy': defaultParameters.sy.defaultValue,
        'top': defaultParameters.top.defaultValue,
        'vka': defaultParameters.vka.defaultValue
    });
    layer1.id = null;
    expect(layer1.id).toHaveLength(36);
});

test('Reorder zones', () => {
    const layer1 = SoilmodelLayer.fromDefault(geometry, activeCells);
    const zone1 = SoilmodelZone.fromDefault();
    const zone2 = new SoilmodelZone();
    const zone3 = new SoilmodelZone();
    zone1.priority = 0;
    zone2.priority = 1;
    zone3.priority = 2;
    layer1.zonesCollection.add(zone1).add(zone2).add(zone3);
    layer1.zonesCollection.changeOrder(zone2, 'up');
    expect(zone2.priority).toEqual(2);
    expect(zone3.priority).toEqual(1);
    layer1.zonesCollection.changeOrder(zone2, 'down');
    expect(zone2.priority).toEqual(1);
    expect(zone3.priority).toEqual(2);
});

test('Zones to parameter and smoothing', () => {
    const gridSize = new GridSize(5, 5);
    const allCells = ActiveCells.fromArray(new Array(gridSize.nY * gridSize.nX).fill(0).map((value, key) => {
        return [Math.floor(key / gridSize.nY), key - Math.floor(key / gridSize.nY) * gridSize.nX]
    }));
    const layer = SoilmodelLayer.fromDefault(geometry, allCells);
    const zone2 = new SoilmodelZone();
    zone2.name = 'Clay';
    zone2.priority = 1;
    zone2.hk.value = 20;
    zone2.hk.isActive = true;
    zone2.activeCells = ActiveCells.fromArray([[0, 1], [0, 2], [0, 3], [0, 4], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]]);
    layer.zonesCollection.add(zone2);
    layer.zonesToParameters(gridSize, 'hk');
    expect(layer.hk).toEqual([
        [10, 20, 20, 10, 10],
        [20, 20, 20, 10, 10],
        [20, 20, 20, 10, 10],
        [20, 10, 10, 10, 10],
        [20, 10, 10, 10, 10]
    ]);
    layer.smoothParameter(gridSize, 'hk');
    expect(layer.hk).toEqual([
        [16, 19.428571428571427, 17.06122448979592, 12.43731778425656, 10.487463556851313],
        [19.346938775510207, 19.183673469387756, 16.811078717201166, 12.679708454810497, 10.800641399416909],
        [18.36151603498542, 17.370320699708454, 14.604478134110787, 11.489590670553936, 10.709991503540193],
        [16.533119533527696, 13.686943440233236, 11.715133294460642, 10.851919360266555, 10.435928790622954],
        [16.044012594752186, 12.568458408996252, 11.260350643422385, 10.60904744125322, 10.379379118428545]
    ]);
    layer.smoothParameter(gridSize, 'hk', 2);
    expect(layer.hk).toEqual([
        [18.14170400904385, 17.585984199149287, 15.620700526969102, 13.355099576830098, 12.190519645825267],
        [17.688995903671955, 16.709132108268328, 14.927688444713928, 13.091313409732042, 12.184802115631214],
        [16.365544899588002, 15.38341551561464, 13.808049883026348, 12.43498464417856, 11.822078084719807],
        [15.023350764284917, 14.16936428494785, 12.884148852794402, 11.891263035683071, 11.44981895422993],
        [14.455205249262454, 13.615275994668313, 12.562524966976676, 11.728353625349184, 11.362141699947383]
    ]);
    layer.smoothParameter(gridSize, 'hk', 2, 2);
    expect(layer.hk).toEqual([
        [14.940845886177451, 14.404938563485189, 14.00327073427298, 13.661326119180195, 13.363028438504173],
        [14.345104309963308, 13.981413206375093, 13.714581046795507, 13.469114318152084, 13.259354452055303],
        [14.007983311263914, 13.758188992244325, 13.571280519906793, 13.382637804656728, 13.224849888248235],
        [13.784687736275613, 13.589083662778345, 13.44719560871571, 13.304188470086437, 13.189290503799771],
        [13.650954907061779, 13.498088146293405, 13.396258624275076, 13.297173175457248, 13.224630985267462]
    ]);
    layer.zonesToParameters(gridSize);
    expect(layer.hani).toEqual([
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1]
    ]);
});