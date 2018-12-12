import AbstractCollection from '../../AbstractCollection';
import Layer from './SoilmodelLayer';

class LayersCollection extends AbstractCollection {

    static fromObject(layers) {
        const lc = new LayersCollection();
        layers.forEach(layer => lc.add(Layer.fromObject(layer)));
        return lc;
    }

    get layers() {
        return this._items;
    }

    set layers(value) {
        this._items = value;
    }

    toObject = () => {
        return {
            layers: this.layers.map(layer => layer.toObject())
        }
    };

    validateInput(layer) {
        if(!layer instanceof Layer) {
            throw new Error('Layer expected to be from Type Layer.');
        }
    }
}

export default LayersCollection;