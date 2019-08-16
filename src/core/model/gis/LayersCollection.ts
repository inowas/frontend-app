import {Collection} from '../collection/Collection';
import {ILayer} from './Layer.type';

class LayersCollection extends Collection<ILayer> {
    public static fromObject(obj: ILayer[]) {
        return new LayersCollection(obj);
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
