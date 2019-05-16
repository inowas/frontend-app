import {Collection} from '../../collection/Collection';
import SoilmodelLayer from './SoilmodelLayer';

class LayersCollection extends Collection<SoilmodelLayer> {
    public static fromArray(array: object[]) {
        const lc = new LayersCollection();
        lc.items = array.map((layer) => SoilmodelLayer.fromObject(layer));
        return lc;
    }

    public reorder() {
        this.items = this.orderBy('number').all.map((layer, key) => {
            layer.number = key;
            return layer;
        });
        return this;
    }

    public toArray() {
        return this.all.map((item) => item.toObject());
    }
}

export default LayersCollection;
