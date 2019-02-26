import Boundary from './Boundary';

export default class HeadObservationWell extends Boundary {

    _type = 'hob';

    _id;
    _geometry;
    _name;
    _layers;
    _cells;
    _spValues;

    static create(id, geometry, name, layers, cells, spValues) {
        const boundary = new this();
        boundary._id = id;
        boundary._geometry = geometry;
        boundary._name = name;
        boundary._layers = layers;
        boundary._cells = cells;
        boundary._spValues = spValues;
        return boundary;
    }

    static fromObject(obj) {
        return this.create(
            obj.id,
            obj.geometry,
            obj.properties.name,
            obj.properties.layers,
            obj.properties.cells,
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

    get layers() {
        return this._layers;
    }

    set layers(value) {
        this._layers = value;
    }

    get cells() {
        return this._cells;
    }

    set cells(value) {
        this._cells = value;
    }

    get spValues() {
        return this._spValues;
    }

    set spValues(value) {
        this._spValues = value;
    }

    toObject() {
        return {
            'type': 'Feature',
            'id': this.id,
            'geometry': this.geometry,
            'properties': {
                'name': this.name,
                'type': this.type,
                'layers': this.layers,
                'cells': this.cells,
                'sp_values': this.spValues
            }
        }
    }

    get geometryType() {
        return 'Point';
    }

    get valueProperties() {
        return [
            {
                name: 'Observed head',
                description: 'Observed head',
                unit: 'm',
                decimals: 2,
                default: 0
            },
        ]
    }
}
