import {GeoJson} from '../../../../../core/model/geometry/Geometry.type';
import {ISoilmodelExport} from '../../../../../core/model/modflow/soilmodel/Soilmodel.type';
import {ModflowModel} from '../../../../../core/model/modflow';
import updater from '../../../../../core/model/modflow/soilmodel/updater/updater';

const model = {
    calculation_id: 'null',
    description: 'Here you can say a bit more about the project',
    discretization: {
        bounding_box: [[20.913427, 51.572375], [23.043095, 52.912422]],
        cells: [],
        geometry: {
            type: 'Polygon',
            coordinates: [[[20.913427, 52.912422], [20.983168, 51.572375], [23.043095, 51.732344],
                [23.030384, 52.905796], [20.913427, 52.912422]]]
        } as GeoJson,
        grid_size: {n_x: 25, n_y: 25},
        length_unit: 2,
        stressperiods: {
            start_date_time: '2000-01-01T00:00:00.000Z',
            end_date_time: '2019-12-31T00:00:00.000Z',
            time_unit: 4,
            stressperiods: [{
                nstp: 1,
                start_date_time: '2000-01-01T00:00:00.000Z',
                steady: true,
                tsmult: 1
            }]
        },
        time_unit: 4,
    },
    id: '52a2919e-391c-40c4-aa90-de97776e711b',
    name: 'Test 5',
    permissions: 'r',
    public: false,
    tool: 'T03'
};

const soilmodel1v0: ISoilmodelExport = {
    layers: [
        {
            name: 'Boa Viagem',
            description: 'Sand layer',
            number: 0,
            laytyp: 1,
            top: 4,
            botm: -25,
            hk: 15,
            hani: 1,
            vka: 1.5,
            layavg: 0,
            laywet: 0,
            ss: 0.00001,
            sy: 0.2
        },
        {
            name: 'Clay layer 1',
            description: '',
            number: 1,
            laytyp: 0,
            top: -25,
            botm: -28,
            hk: 0.01,
            hani: 1,
            vka: 0.001,
            layavg: 0,
            laywet: 0,
            ss: 0.00001,
            sy: 0.2
        }
    ]
};

test('Update soilmodel from 1v0 to 2v1', () => {
    updater(soilmodel1v0, ModflowModel.fromObject(model), () => null, (updatedSoilmodel) => {
        expect(updatedSoilmodel.layers).toHaveLength(2);
        expect(updatedSoilmodel.layers[0].relations).toHaveLength(7);
        expect(updatedSoilmodel.layers[1].parameters).toHaveLength(7);
        expect(updatedSoilmodel.properties.zones).toHaveLength(1);
        expect(updatedSoilmodel.properties.zones[0].id).toEqual('default');
        expect(updatedSoilmodel.properties.version).toEqual('2.1');
    });
});
