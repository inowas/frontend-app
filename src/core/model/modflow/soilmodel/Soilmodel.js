import uuidv4 from 'uuid/v4';
import SoilmodelLayer from './SoilmodelLayer';

class Soilmodel {
    _id = uuidv4();
    _meta = {};
    _general = {
        _wetfct: 0.1
    };
    _layers = [];

    static fromObject(obj) {
        const soilmodel = new Soilmodel();
        if (obj) {
            soilmodel.id = obj.id;
            soilmodel.general = obj.general;
            soilmodel.meta = obj.meta;
            if (obj.layers) {
                obj.layers.forEach((layer) => {
                    soilmodel.addLayer(SoilmodelLayer.fromObject(layer));
                });
            }
        }
        return soilmodel;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value ? value : uuidv4();
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

    get layers() {
        return this._layers;
    }

    set layers(value) {
        this._layers = value ? value : [];
    }

    get toObject() {
        return {
            'id': this.id,
            'meta': this.meta,
            'general': this.general,
            'layers': this.layers.map(l => l.toObject)
        };
    }

    addLayer(layer) {
        if (!(layer instanceof SoilmodelLayer)) {
            throw new Error('The layer object is not of type SoilmodelLayer.');
        }
        const layers = this.layers;
        layers.push(layer);
        this.layers = layers;
        return this;
    }

    removeLayer(layer) {
        this.layers = this.layers.filter(l => l.id !== layer.id);
        return this;
    }

    updateLayer(layer) {
        this.layers = this.layers.map(l => {
            if (l.id === layer.id) {
                return layer;
            }
            return l;
        });
        return this;
    }
}

export default Soilmodel;
