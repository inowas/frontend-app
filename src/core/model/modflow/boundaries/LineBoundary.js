import Uuid from 'uuid';
import Boundary from './Boundary';

export default class LineBoundary extends Boundary {

    _main = {
        type: '',
        id: '',
        geometry: {
            type: 'LineString',
            coordinates: [],
        },
        properties: {
            name: '',
            layers: [],
            cells: []
        }
    };

    _observationPoints = [];

    static create(id, geometry, name, layers, cells, spValues = null) {

        const boundary = new this();
        boundary._main.id = id;
        boundary._main.geometry = geometry;
        boundary._main.properties.name = name;
        boundary._main.properties.layers = layers;
        boundary._main.properties.cells = cells;

        if (spValues) {
            boundary.addObservationPoint('' +
                'OP1',
                {type: 'Point', coordinates: geometry.coordinates[0]},
                spValues
            );
        }

        return boundary;
    }

    static fromObject(obj) {
        const features = obj.features;
        const main = features.filter(feature => feature.properties.type !== 'op')[0];

        const boundary = this.create(
            main.id,
            main.geometry,
            main.properties.name,
            main.properties.layers,
            main.properties.cells,
        );

        const ops = features.filter(feature => feature.properties.type === 'op');
        ops.forEach(op => boundary._observationPoints.push(op));
        return boundary;
    }


    constructor(type) {
        super();
        this._main.type = type
    }

    get observationPoints() {
        return this._observationPoints;
    }

    addObservationPoint = (name, geometry, spValues) => {
        const op = {
            type: 'Feature',
            id: Uuid.v4(),
            geometry,
            properties: {
                type: 'op',
                name,
                sp_values: spValues
            }
        };

        this._observationPoints.push(op)
    };

    cloneObservationPoint = (id, newId) => {
        const filtered = this._observationPoints.filter(op => op.id === id);

        if (filtered.length === 0) {
            return;
        }

        const op = filtered[0];
        op.id = newId;
        this._observationPoints.push(op);
    };

    updateObservationPoint = (id, name, geometry, spValues) => {
        this._observationPoints = this._observationPoints.map(exitingOp => {
            if (id === exitingOp.id) {
                return {
                    type: 'Feature',
                    id,
                    geometry,
                    properties: {
                        name,
                        sp_values: spValues
                    }
                };
            }

            return exitingOp;
        });
    };

    removeObservationPoint = (opId) => {
        if (this._observationPoints.length === 1) {
            return;
        }
        this._observationPoints = this._observationPoints.filter(exitingOp => opId !== exitingOp.id);
    };

    findObservationPointByName = name => {
        const filtered = this._observationPoints.filter(op => op.properties.name === name);
        if (filtered.length > 0) {
            return filtered[0];
        }

        return null;
    };

    findObservationPointById = id => {
        const filtered = this._observationPoints.filter(op => op.id === id);
        if (filtered.length > 0) {
            return filtered[0];
        }

        return null;
    };

    get type() {
        return this._main.type;
    }

    get id() {
        return this._main.id;
    }

    set id(value) {
        this._main.id = value;
    }

    get geometry() {
        return this._main.geometry;
    }

    set geometry(value) {
        this._main.geometry = value;
    }

    get name() {
        return this._main.properties.name;
    }

    set name(value) {
        this._main.properties.name = value;
    }

    get cells() {
        return this._main.properties.cells;
    }

    set cells(value) {
        this._main.properties.cells = value;
    }

    get layers() {
        return this._main.properties.layers;
    }

    set layers(value) {
        this._main.properties.layers = value;
    }

    toObject() {
        const obj = {
            type: 'FeatureCollection',
            features: []
        };

        obj.features.push(this._main);
        this._observationPoints.forEach(op => obj.features.push(op));
        return obj;
    }

    get geometryType() {
        return this._main.geometry()['type'];
    }

    get valueProperties() {
        return []
    }
}
