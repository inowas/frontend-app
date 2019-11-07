import {cloneDeep} from 'lodash';
import uuidv4 from 'uuid/v4';
import {defaultSoilmodelParameters} from '../../../../scenes/t03/defaults/soilmodel';
import {versions} from '../../../../scenes/t03/updaters/versions';
import {Cells, Geometry} from '../../geometry';
import {LayersCollection, RasterParametersCollection, ZonesCollection} from './index';
import {ISoilmodel, ISoilmodel1v0, ISoilmodel2v0} from './Soilmodel.type';
import SoilmodelLayer from './SoilmodelLayer';
import SoilmodelLegacy from './SoilmodelLegacy';
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
                return top[0].value;
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
                version: versions.soilmodel,
                zones: [defaultZone]
            }
        });
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

    public static isLegacy(input: ISoilmodel | ISoilmodel1v0 | ISoilmodel2v0) {
        return !input.properties || (input.properties && input.properties.version !== versions.soilmodel);
    }

    private readonly _props: ISoilmodel;

    constructor(props: ISoilmodel) {
        this._props = cloneDeep(props);
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
