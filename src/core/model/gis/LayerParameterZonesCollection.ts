import {Collection} from '../collection/Collection';
import {ILayer} from './Layer.type';
import {ILayerParameterZone} from './LayerParameterZone.type';
import LayersCollection from './LayersCollection';
import {IRasterParameter} from './RasterParameter.type';
import RasterParametersCollection from './RasterParametersCollection';
import {ZonesOrderChange} from './types';
import {IZone} from './Zone.type';
import ZonesCollection from './ZonesCollection';

class LayerParameterZonesCollection extends Collection<ILayerParameterZone> {
    public static fromObject(obj: ILayerParameterZone[]) {
        return new LayerParameterZonesCollection(obj);
    }

    private _layers: LayersCollection = new LayersCollection();
    private _parameters: RasterParametersCollection = new RasterParametersCollection();
    private _zones: ZonesCollection = new ZonesCollection();

    public setData(layers: ILayer[], parameters: IRasterParameter[], zones: IZone[]) {
        this._layers = LayersCollection.fromObject(layers);
        this._parameters = RasterParametersCollection.fromObject(parameters);
        this._zones = ZonesCollection.fromObject(zones);
    }

    get layers(): ILayer[] {
        return this._layers.all;
    }

    set layers(value: ILayer[]) {
        this._layers = LayersCollection.fromObject(value);
    }

    get parameters(): IRasterParameter[] {
        return this._parameters.all;
    }

    set parameters(value: IRasterParameter[]) {
        this._parameters = RasterParametersCollection.fromObject(value);
    }

    get zones(): IZone[] {
        return this._zones.all;
    }

    set zones(value: IZone[]) {
        this._zones = ZonesCollection.fromObject(value);
    }

    public getUniqueLayersByZoneId(zoneId: string) {
        if (this.layers.length > 0) {
            return this.all.filter((r) => r.zoneId === zoneId).map((r) => {
                return this._layers.findById(r.id);
            });
        }
        return null;
    }

    public getZoneIds(layerId: string, parameter: string) {
        return this.all.filter((r) =>
            r.layerId === layerId && r.parameter === parameter
        ).map((r) => r.zoneId);
    }

    public changeOrder(relation: ILayerParameterZone, order: ZonesOrderChange) {
        if (relation.priority === 0) {
            return null;
        }

        let zoneToSwitch = null;
        switch (order) {
            case 'up':
                zoneToSwitch = this.findBy('priority', relation.priority + 1, true);
                if (zoneToSwitch.length === 1 && zoneToSwitch[0].priority !== 0) {
                    zoneToSwitch[0].priority = zoneToSwitch[0].priority - 1;
                    relation.priority = relation.priority + 1;
                }
                break;
            case 'down':
                zoneToSwitch = this.findBy('priority', relation.priority - 1, true);
                if (zoneToSwitch.length === 1 && zoneToSwitch[0].priority !== 0) {
                    zoneToSwitch[0].priority = zoneToSwitch[0].priority + 1;
                    relation.priority = relation.priority - 1;
                }
                break;
            default:
                return this;
        }
        return this;
    }

    public reorderPriority(layerId: string, parameter: string) {
        let priority = 0;
        this.items = this.orderBy('priority').all.map((r, key) => {
            if (r.layerId === layerId && r.parameter === parameter) {
                r.priority = priority;
                priority++;
            }
            return r;
        });

        return this;
    }

    public toObject() {
        return this.all;
    }
}

export default LayerParameterZonesCollection;
