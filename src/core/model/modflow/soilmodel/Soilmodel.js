import LayersCollection from './LayersCollection';
import ModflowModel from "../ModflowModel";

class Soilmodel {
    _meta = {};
    _general = {
        _wetfct: 0.1
    };
    _layers = new LayersCollection();

    static fromDefaults() {
        return new Soilmodel();
    }

    static fromObject(obj) {
        if(!obj) {
            return Soilmodel.fromDefaults();
        }

        const soilmodel = new Soilmodel();
        soilmodel.general = obj.general;
        soilmodel.meta = obj.meta;
        soilmodel.layersCollection = LayersCollection.fromArray(obj.layers);
        return soilmodel;
    }

    get meta() {
        return this._meta;
    }

    set meta(value) {
        this._meta = value ? value : {};
    }

    get general() {
        return {
            wetfct: this._general._wetfct
        };
    }

    set general(value) {
        this._general = {
            _wetfct: value ? value.wetfct : 0.1
        };
    }

    get layersCollection() {
        return this._layers;
    }

    set layersCollection(value) {
        if (!(value instanceof LayersCollection)) {
            throw new Error('Layers expected to be instance of LayersCollection');
        }
        this._layers = value;
    }

    toObject() {
        return {
            'meta': this.meta,
            'general': this.general,
            'layers': this.layersCollection.toArray()
        };
    }

    updateGeometry(model) {
        if (!(model instanceof ModflowModel)) {
            throw new Error('Model needs to be instance of ModflowModel');
        }
        this.layersCollection.items = this.layersCollection.all.map(layer => layer.updateGeometry(model));
    }
}

export default Soilmodel;
