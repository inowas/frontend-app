import Boundary from './Boundary';

export default class WellBoundary extends Boundary {

    _type = 'wel';
    _id;
    _geometry;
    _name;
    _layers;
    _cells;
    _wellType;
    _spValues;

    static create(id, geometry, name, layers, cells, spValues) {
        const boundary = new this();
        boundary.id = id;
        boundary.geometry = geometry;
        boundary.name = name;
        boundary.layers = layers;
        boundary.cells = cells;
        boundary.wellType = boundary.wellTypes.default;
        boundary.spValues = spValues;
        return boundary;
    }

    static fromObject(obj) {
        const wellBoundary = this.create(
            obj.id,
            obj.geometry,
            obj.properties.name,
            obj.properties.layers,
            obj.properties.cells,
            obj.properties.sp_values,
        );

        wellBoundary.wellType = obj.properties.well_type;
        return wellBoundary;
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

    get wellType() {
        return this._wellType;
    }

    set wellType(value) {
        this._wellType = value;
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

    setSpValues(spValues, opId = null) {
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
                'layers': this.layers,
                'cells': this.cells,
                'well_type': this.wellType,
                'sp_values': this.spValues
            }
        }
    }

    get geometryType() {
        return 'Point';
    }

    get wellTypes() {
        return {
            default: 'puw',
            types: [
                {
                    name: 'Public Well',
                    value: 'puw'
                },
                {
                    name: 'Infiltration Well',
                    value: 'inw'
                },
                {
                    name: 'Industrial Well',
                    value: 'iw'
                },
                {
                    name: 'Irrigation Well',
                    value: 'irw'
                },
                {
                    name: 'Optimized Well',
                    value: 'opw'
                }
            ]
        }
    }

    get valueProperties() {
        return [
            {
                name: 'Pumping rate',
                description: 'Pumping rate of the well, positive values = infiltration',
                unit: 'm³/day',
                decimals: 1,
                default: 0
            },
        ]
    }
}
