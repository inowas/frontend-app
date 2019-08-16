import {Polygon} from 'geojson';
import {Geometry} from '../../../../../core/model/geometry';
import {ICell} from '../../../../../core/model/geometry/Cells.type';
import GridSize from '../../../../../core/model/geometry/GridSize';
import LayerParameterZonesCollection from '../../../../../core/model/gis/LayerParameterZonesCollection';
import ZonesCollection from '../../../../../core/model/gis/ZonesCollection';
import SoilmodelLayer from '../../../../../core/model/modflow/soilmodel/SoilmodelLayer';
import {defaultSoilmodelLayer} from '../../../../../scenes/t03/defaults/soilmodel';

test('Zones to parameters', () => {
    const gridSize = new GridSize(3, 3);
    const layer = new SoilmodelLayer(defaultSoilmodelLayer);
    layer.id = '0cda5c8e-f583-4067-a1b8-d90308f3dea7';
    const relations = LayerParameterZonesCollection.fromObject([
        {
            id: 'e985646b-4004-42c6-bbaa-3da95edb4323',
            layerId: '0cda5c8e-f583-4067-a1b8-d90308f3dea7',
            parameter: 'top',
            priority: 2,
            value: 30,
            zoneId: 'fa0faf20-3c58-4c47-9bcd-874d8b956db6'
        },
        {
            id: 'addd174a-2c91-4034-a5c9-5580866a6a41',
            layerId: '0cda5c8e-f583-4067-a1b8-d90308f3dea7',
            parameter: 'top',
            priority: 1,
            value: 20,
            zoneId: '7769f221-55bb-41fb-8701-82464f4c1ae6'
        },
        {
            id: 'a9c65539-7d60-46fb-b802-72225f4a4f2b',
            layerId: '0cda5c8e-f583-4067-a1b8-d90308f3dea7',
            parameter: 'top',
            priority: 0,
            value: 10,
            zoneId: '00fe15c0-3fa4-45c9-b275-da3bb4ae2030'
        }
    ]);
    const zones = ZonesCollection.fromObject([
        {
            cells: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]] as ICell[],
            geometry: Geometry.fromGeoJson({
                coordinates: [[13.136136, 51.678091], [13.131326, 50.632913], [14.596568, 50.618756],
                    [14.777963, 51.648916], [13.136136, 51.678091]],
                type: 'Polygon'
            }).toGeoJSON(),
            id: '00fe15c0-3fa4-45c9-b275-da3bb4ae2030',
            name: 'Default Zone'
        },
        {
            cells: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]] as ICell[],
            geometry: Geometry.fromGeoJson({
                coordinates: [[13.136136, 51.678091], [13.131326, 50.632913], [14.596568, 50.618756],
                    [14.777963, 51.648916], [13.136136, 51.678091]],
                type: 'Polygon'
            }).toGeoJSON(),
            id: 'fa0faf20-3c58-4c47-9bcd-874d8b956db6',
            name: 'Zone 1'
        },
        {
            cells: [[0, 2], [1, 2], [2, 2]] as ICell[],
            geometry: Geometry.fromGeoJson({
                coordinates: [[13.136136, 51.678091], [13.131326, 50.632913], [14.596568, 50.618756],
                    [14.777963, 51.648916], [13.136136, 51.678091]],
                type: 'Polygon'
            }).toGeoJSON(),
            id: '7769f221-55bb-41fb-8701-82464f4c1ae6',
            name: 'Zone 2'
        }
    ]);
    expect(layer.zonesToParameters(gridSize, relations, zones).toObject()).toEqual({
        id: '0cda5c8e-f583-4067-a1b8-d90308f3dea7',
        name: 'Default layer',
        description: '',
        number: 0,
        layavg: 0,
        laytyp: 0,
        laywet: 0,
        parameters: [
            {
                id: 'top',
                value: [[30, 30, 10], [30, 30, 10], [30, 30, 20]]
            },
            {
                id: 'botm',
                value: 0
            },
            {
                id: 'hk',
                value: 10
            },
            {
                id: 'hani',
                value: 1
            },
            {
                id: 'vka',
                value: 1
            },
            {
                id: 'ss',
                value: 0.00002
            },
            {
                id: 'sy',
                value: 0.15
            }
        ]
    });
});
