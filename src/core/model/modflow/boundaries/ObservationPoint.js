export default class ObservationPoint {

    _type = 'op';
    _id;
    _name;
    _geometry;
    _spValues;

    static create(id, geometry, name, spValues) {
        const op = new this();
        op.id = id;
        op.geometry = geometry;
        op.name = name;
        op.spValues = spValues;
        return op;
    }

    static fromObject(obj) {
        return this.create(
            obj.id,
            obj.geometry,
            obj.properties.name,
            obj.properties.sp_values,
        );
    }

    get type() {
        return this._type;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get geometry() {
        return this._geometry;
    }

    set geometry(value) {
        this._geometry = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get spValues() {
        return this._spValues;
    }

    set spValues(value) {
        this._spValues = value;
    }

    getSpValues() {
        return this._spValues;
    }

    setSpValues(spValues) {
        this._spValues = spValues;
    }

    toObject() {
        return {
            'type': 'Feature',
            'id': this.id,
            'geometry': this.geometry,
            'properties': {
                'name': this.name,
                'type': this.type,
                'sp_values': this.spValues
            }
        }
    }

    // noinspection JSMethodCanBeStatic
    get geometryType() {
        return 'Point';
    }
}
