import LayersCollection from './LayersCollection';

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
        soilmodel.layers = LayersCollection.fromObject(obj.layers);
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

    get layers() {
        return this._layers;
    }

    set layers(value) {
        this._layers = value ? value : [];
    }

    toObject() {
        return {
            'meta': this.meta,
            'general': this.general,
            'layers': this.layers.all.map(l => l.toObject())
        };
    }
}

export default Soilmodel;
