import uuidv4 from 'uuid/v4';
import {defaultSoilmodelParameters} from '../../../../scenes/t03/defaults/soilmodel';
import {Cells, Geometry} from '../../geometry';
import {RasterParametersCollection, ZonesCollection} from '../../gis';
import {ILayerParameterZone} from '../../gis/LayerParameterZone.type';
import LayerParameterZonesCollection from '../../gis/LayerParameterZonesCollection';
import LayersCollection from '../../gis/LayersCollection';
import {IRasterParameter} from '../../gis/RasterParameter.type';
import {IZone, IZoneLegacy} from '../../gis/Zone.type';
import {ISoilmodel, ISoilmodelLegacy} from './Soilmodel.type';
import SoilmodelLayer from './SoilmodelLayer';
import {ISoilmodelLayer, ISoilmodelLayerLegacy} from './SoilmodelLayer.type';
import { cloneDeep } from 'lodash';

class Soilmodel {
    get layersCollection() {
        return LayersCollection.fromObject(this._props.layers);
    }

    set layersCollection(value: LayersCollection) {
        this._props.layers = value.toObject();
    }

    get parametersCollection() {
        return RasterParametersCollection.fromObject(this._props.properties.parameters);
    }

    set parametersCollection(value: RasterParametersCollection) {
        this._props.properties.parameters = value.toObject();
    }

    get relationsCollection() {
        return LayerParameterZonesCollection.fromObject(this._props.properties.relations);
    }

    set relationsCollection(value: LayerParameterZonesCollection) {
        this._props.properties.relations = value.toObject();
    }

    get zonesCollection() {
        return ZonesCollection.fromObject(this._props.properties.zones);
    }

    set zonesCollection(value: ZonesCollection) {
        this._props.properties.zones = value.toObject();
    }

    get top() {
        console.log(this);
        const topLayer = this.layersCollection.findFirstBy('number', 0);
        if (topLayer) {
            const top = topLayer.parameters.filter((p) => p.id === 'top');
            if (top.length > 0) {
                return top[0].value;
            }
            throw new Error('Top layer must contain parameter with name top.');
        }
        throw new Error('Soilmodel must contain layer with number 0.');
    }

    public static fromDefaults(geometry: Geometry, cells: Cells) {
        const parameters = defaultSoilmodelParameters;

        const defaultLayer = SoilmodelLayer.fromDefault().toObject();

        const defaultZone: IZone = {
            id: uuidv4(),
            name: 'Default Zone',
            geometry: geometry.toObject(),
            cells: cells.toObject()
        };

        const relations: ILayerParameterZone[] = parameters.map((p) => {
            return {
                id: uuidv4(),
                layerId: defaultLayer.id,
                parameter: p.id,
                zoneId: defaultZone.id,
                value: p.defaultValue,
                priority: 0
            };
        });

        return new Soilmodel({
            layers: [defaultLayer],
            properties: {
                parameters,
                relations,
                zones: [defaultZone]
            }
        });
    }

    public static fromObject(obj: ISoilmodel) {
        return new Soilmodel(obj);
    }

    public static fromQuery(obj: ISoilmodel | ISoilmodelLegacy) {
        const isLegacy = (input: ISoilmodel | ISoilmodelLegacy): input is ISoilmodelLegacy => {
            return input.layers.length > 0 && 'top' in input.layers[0];
        };

        if (isLegacy(obj)) {
            type parameterProp = 'top' | 'botm' | 'vka' | 'hk' | 'hani' | 'ss' | 'sy';
            const paramsLegacy = ['top', 'botm', 'vka', 'hk', 'hani', 'ss', 'sy'];
            const relations: ILayerParameterZone[] = [];
            const parameters: IRasterParameter[] = defaultSoilmodelParameters;
            const zones: IZone[] = [];
            const layers: ISoilmodelLayer[] = [];

            obj.layers.forEach((layer: ISoilmodelLayerLegacy) => {
                layer._meta.zones.forEach((zone: IZoneLegacy) => {
                    const newZone: IZone = {
                        id: zone.id,
                        name: zone.name,
                        geometry: zone.geometry,
                        cells: zone.cells
                    };
                    Object.keys(zone).filter((k) => paramsLegacy.includes(k)).forEach((key) => {
                        if (zone[key as parameterProp].isActive) {
                            const newRelation = {
                                id: uuidv4(),
                                layerId: layer.id,
                                zoneId: zone.id,
                                parameter: key,
                                value: zone[key as parameterProp].value,
                                priority: zone.priority
                            };
                            relations.push(newRelation);
                        }
                    });
                    zones.push(newZone);

                });
                const newLayer: ISoilmodelLayer = {
                    id: layer.id,
                    name: layer.name,
                    description: layer.description,
                    number: layer.number,
                    layavg: layer.layavg,
                    laytyp: layer.laytyp,
                    laywet: layer.laywet,
                    parameters: Object.keys(layer).filter((k) => paramsLegacy.includes(k)).map((key) => {
                        return {
                            id: key,
                            value: layer[key as parameterProp]
                        };
                    })
                };
                layers.push(newLayer);
            });

            return new Soilmodel({
                layers,
                properties: {
                    relations,
                    parameters,
                    zones
                }
            });
        }
        return new Soilmodel(obj);
    }

    private readonly _props: ISoilmodel;

    constructor(props: ISoilmodel) {
        this._props = cloneDeep(props);
    }

    public getZonesByLayerAndParameter(layerId: string, parameterId: string) {
        const relations = this.relationsCollection.getZoneIds(layerId, parameterId);
        if (relations.length > 0) {
            return ZonesCollection.fromObject(this.zonesCollection.all.filter((z) => relations.includes(z.id)));
        }
        return new ZonesCollection();
    }

    public getParameterValue(param: string) {
        return this.layersCollection.all.map((layer) => {
            const parameter = layer.parameters.filter((p) => p.id === param);
            if (parameter.length > 0) {
                return parameter[0].value;
            }
            throw new Error(`Layer must contain parameter with name ${param}`);
        });
    }

    public toObject = () => (this._props);
}

export default Soilmodel;
