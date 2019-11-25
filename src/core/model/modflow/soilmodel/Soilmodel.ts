import {cloneDeep} from 'lodash';
import uuidv4 from 'uuid/v4';
import {defaultSoilmodelParameters} from '../../../../scenes/t03/defaults/soilmodel';
import {Cells, Geometry} from '../../geometry';
import { Array2D } from '../../geometry/Array2D.type';
import {ModflowModel} from '../index';
import {LayersCollection, RasterParametersCollection, ZonesCollection} from './index';
import {ISoilmodel, ISoilmodel1v0, ISoilmodel2v0, ISoilmodelExport} from './Soilmodel.type';
import SoilmodelLayer from './SoilmodelLayer';
import {ISoilmodelLayer} from './SoilmodelLayer.type';
import SoilmodelLegacy from './SoilmodelLegacy';
import {version} from './updater/defaults';
import updateSoilmodel from './updater/updateSoilmodel';
import {IZone} from './Zone.type';

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

    get zonesCollection() {
        return ZonesCollection.fromObject(this._props.properties.zones);
    }

    set zonesCollection(value: ZonesCollection) {
        this._props.properties.zones = value.toObject();
    }

    get top() {
        const topLayer = this.layersCollection.findFirstBy('number', 0);
        if (topLayer) {
            const top = topLayer.parameters.filter((p) => p.id === 'top');
            if (top.length > 0) {
                return top[0].value !== undefined ? top[0].value : top[0].data.data as number | Array2D<number>;
            }
            throw new Error('Top layer must contain parameter with name top.');
        }
        throw new Error('Soilmodel must contain layer with number 0.');
    }

    public static fromDefaults(geometry: Geometry, cells: Cells) {
        const parameters = defaultSoilmodelParameters;

        const defaultLayer = SoilmodelLayer.fromDefault();

        const defaultZone: IZone = {
            id: 'default',
            isDefault: true,
            name: 'Default Zone',
            geometry: geometry.toObject(),
            cells: cells.toObject()
        };

        parameters.forEach((p) => {
            defaultLayer.addRelation({
                data: {
                    file: null
                },
                id: uuidv4(),
                parameter: p.id,
                priority: 0,
                value: p.defaultValue,
                zoneId: defaultZone.id,
            });
        });

        return new Soilmodel({
            layers: [defaultLayer.toObject()],
            properties: {
                parameters,
                version,
                zones: [defaultZone]
            }
        });
    }

    public static fromExport(obj: ISoilmodelExport, model: ModflowModel) {
        if (this.isLegacy(obj)) {
            const result = updateSoilmodel(obj, model);
            return new Soilmodel(result.soilmodel);
        }
        return new Soilmodel(obj as ISoilmodel);
    }

    public static fromObject(obj: ISoilmodel) {
        return new Soilmodel(obj);
    }

    public static fromQuery(obj: ISoilmodel | ISoilmodel1v0 | ISoilmodel2v0) {
        if (Soilmodel.isLegacy(obj)) {
            return new SoilmodelLegacy(obj as ISoilmodel1v0 | ISoilmodel2v0);
        }

        return new Soilmodel(obj as ISoilmodel);
    }

    public static isLegacy(input: any) {
        return !input.properties || (input.properties && input.properties.version !== version);
    }

    private readonly _props: ISoilmodel;

    constructor(props: ISoilmodel) {
        this._props = cloneDeep(props);
    }

    public addLayer(layer: ISoilmodelLayer) {
        const defaultZone = this.zonesCollection.findFirstBy('isDefault', true);
        if (layer.relations.length === 0 && this.zonesCollection.length > 0) {
            if (defaultZone) {
                defaultSoilmodelParameters.forEach((p) => {
                    layer.relations.push({
                        id: uuidv4(),
                        data: {file: null},
                        parameter: p.id,
                        priority: 0,
                        zoneId: defaultZone.id
                    });
                });
            }
        }
        if (layer.relations.length === 0 && !defaultZone) {
            throw new Error('Layer has no relations and default zone does not exist.');
        }
        this._props.layers.push(layer);
        return this;
    }

    public updateLayer(layer: ISoilmodelLayer) {
        this._props.layers = this.layersCollection.all.map((l) => {
            if (layer.id === l.id) {
                return layer;
            }
            return l;
        });
        return this;
    }

    public getParameterValue(param: string) {
        return this.layersCollection.all.map((layer) => {
            const parameter = layer.parameters.filter((p) => p.id === param);
            if (parameter.length > 0) {
                if (parameter[0].value !== null && parameter[0].value !== undefined) {
                    return parameter[0].value;
                }
                if (parameter[0].data.data) {
                    return parameter[0].data.data;
                }
            }
            throw new Error(`Layer ${layer.id} must contain parameter with name ${param}`);
        });
    }

    public toExport = () => (this._props);

    public toObject = () => (this._props);
}

export default Soilmodel;
