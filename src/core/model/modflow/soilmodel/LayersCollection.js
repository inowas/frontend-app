import AbstractCollection from '../../../AbstractCollection';
import SoilmodelLayer from './SoilmodelLayer';

class LayersCollection extends AbstractCollection {
    static fromArray(array) {
        const lc = new LayersCollection();
        lc.items = array.map(layer => SoilmodelLayer.fromObject(layer));
        return lc;
    }

    validateInput(layer) {
        if (!(layer instanceof SoilmodelLayer)) {
            throw new Error('Layer expected to be from Type Layer.');
        }
        return layer;
    }

    reorder() {
        this.items = this.orderBy('number').all.map((layer, key) => {
             layer.number = key + 1;
             return layer;
        });
    }
}

export default LayersCollection;