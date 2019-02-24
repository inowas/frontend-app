import Uuid from 'uuid';

export default class RiverBoundary {

    _type = 'riv';

    _river = {
        type: 'riv',
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
        const boundary = new RiverBoundary();
        boundary._river.id = id;
        boundary._river.geometry = geometry;
        boundary._river.properties.name = name;
        boundary._river.properties.layers = layers;
        boundary._river.properties.cells = cells;

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
        const river = features.filter(feature => feature.type === 'riv')[0];

        const boundary = RiverBoundary.create(
            river.id,
            river.geometry,
            river.properties.name,
            river.properties.layers,
            river.properties.cells,
        );

        const ops = features.filter(feature => feature.properties.type === 'op');
        ops.forEach(op => boundary._observationPoints.push(op));
        return boundary;
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

    updateObservationPoint = (id, name, geometry, spValues) => {
        this._observationPoints.map(exitingOp => {
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
        this._observationPoints.filter(exitingOp => opId !== exitingOp.id);
    };

    get type() {
        return this._river.type;
    }

    get id() {
        return this._river.id;
    }

    set id(value) {
        this._river.id = value;
    }

    get geometry() {
        return this._river.geometry;
    }

    set geometry(value) {
        this._river.geometry = value;
    }

    get name() {
        return this._river.properties.name;
    }

    set name(value) {
        this._river.properties.name = value;
    }

    get cells() {
        return this._river.properties.cells;
    }

    set cells(value) {
        this._river.properties.cells = value;
    }

    get layers() {
        return this._river.properties.layers;
    }

    set layers(value) {
        this._river.properties.layers = value;
    }

    toObject() {
        const obj = {
            type: 'FeatureCollection',
            features: []
        };

        obj.features.push(this._river);
        this._observationPoints.forEach(op => obj.features.push(op));
        return obj;
    }

    get geometryType() {
        return this._river.geometry()['type'];
    }

    get valueProperties() {
        return [
            {
                name: 'Stage',
                description:'River stage in m above sea level',
                unit: 'm',
                decimals: 1
            },
            {
                name: 'Cond',
                description: 'Riverbed conductance',
                unit: 'm/day',
                decimals: 1
            },
            {
                name: 'Bottom',
                description:'River bottom in m above sea level',
                unit: 'm',
                decimals: 1
            }
        ]
    }
}
