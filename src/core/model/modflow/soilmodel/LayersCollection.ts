import {Collection} from '../../collection/Collection';
import {ISoilmodelLayer} from './SoilmodelLayer.type';

class LayersCollection extends Collection<ISoilmodelLayer> {
    public static fromObject(obj: ISoilmodelLayer[]) {
        return new LayersCollection(obj);
    }

    public toObject() {
        return this.all;
    }

    public getAffectedByZone(zoneId: string) {
        return this.all.filter((l) =>
            l.relations.filter((r) => r.zoneId === zoneId).length > 0
        );
    }

    public reorder() {
        this.items = this.orderBy('number').all.map((layer, key) => {
            layer.number = key;
            return layer;
        });
        return this;
    }
}

export default LayersCollection;
