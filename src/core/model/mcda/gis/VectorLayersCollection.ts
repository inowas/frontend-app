import {Collection} from '../../collection/Collection';
import {IVectorLayer} from './VectorLayer.type';

class VectorLayersCollection extends Collection<IVectorLayer> {
    public static fromObject(obj: IVectorLayer[]) {
        return new VectorLayersCollection(obj);
    }

    public toObject() {
        return this.all;
    }
}

export default VectorLayersCollection;
