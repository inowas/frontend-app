import Uuid from 'uuid';
import Boundary from './Boundary';
import ObservationPoint from './ObservationPoint';
import * as turf from '@turf/helpers';
import {lineDistance, lineSlice} from '@turf/turf';

const distanceOnLine = (boundaryGeometry, opGeometry) => {
    const start = turf.point(boundaryGeometry.coordinates[0]);
    const end = turf.point(opGeometry.coordinates);
    const linestring = turf.lineString(boundaryGeometry.coordinates);
    const sliced = lineSlice(start, end, linestring);
    return lineDistance(sliced);
};

export default class LineBoundary extends Boundary {

    _main = {
        type: 'Feature',
        id: '',
        geometry: {
            type: 'LineString',
            coordinates: [],
        },
        properties: {
            type: '',
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
            boundary.addObservationPoint(
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
        this._main.properties.type = type
    }

    get observationPoints() {
        return this._observationPoints.map(op => ObservationPoint.fromObject(op));
    }

    addObservationPoint = (name, geometry, spValues) => {
        const op = ObservationPoint.create(Uuid.v4(), geometry, name, spValues, distanceOnLine(this.geometry, geometry));
        this._observationPoints.push(op.toObject());
        this._observationPoints.sort((a, b) => ObservationPoint.fromObject(a).distance - ObservationPoint.fromObject(b).distance);
    };

    cloneObservationPoint = (id, newId) => {
        let op = ObservationPoint.fromObject(this.findObservationPointById(id));
        op.id = newId;
        this._observationPoints.push(op.toObject());
    };

    updateObservationPoint = (id, name, geometry, spValues) => {
        let op = ObservationPoint.fromObject(this.findObservationPointById(id));
        op.name = name;
        op.geometry = geometry;
        op.spValues = spValues;
        op.distance = distanceOnLine(this.geometry, geometry);

        this._observationPoints = this._observationPoints.map(existingOp => {
            if (op.id === existingOp.id) {
                return op.toObject()
            }

            return existingOp;
        });

        this._observationPoints.sort((a, b) => ObservationPoint.fromObject(a).distance - ObservationPoint.fromObject(b).distance);
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

        throw new Error('ObservationPoint with name: ' + name + ' not found.')
    };

    findObservationPointById = id => {
        const filtered = this._observationPoints.filter(op => op.id === id);

        if (filtered.length > 0) {
            return filtered[0];
        }

        throw new Error('ObservationPoint with id: ' + id + ' not found.')
    };

    get type() {
        return this._main.properties.type;
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


    getSpValues(opId) {
        const op = this.findObservationPointById(opId);
        if (op === null) {
            return null;
        }

        return op.properties.sp_values;
    }

    setSpValues(spValues, opId) {
        const op = this.findObservationPointById(opId);
        this.updateObservationPoint(opId, op.properties.name, op.geometry, spValues);
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
        return 'LineString';
    }

    get valueProperties() {
        return []
    }
}
