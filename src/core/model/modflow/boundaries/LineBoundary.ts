import * as turf from '@turf/helpers';
import {lineDistance, lineSlice} from '@turf/turf';
import {FeatureCollection, LineString, Point} from 'geojson';
import Uuid from 'uuid';
import uuidv4 from 'uuid/v4';
import {ICells} from '../../geometry/Cells.type';
import Boundary from './Boundary';
import {ILineBoundary, ILineBoundaryFeature} from './LineBoundary.type';
import ObservationPoint from './ObservationPoint';
import {IObservationPoint} from './ObservationPoint.type';
import {LineBoundaryType, SpValues} from './types';

interface IValueProperty {
    name: string;
    description: string;
    unit: string;
    decimals: number;
    default: number;
}

const distanceOnLine = (boundaryGeometry: LineString, opGeometry: Point) => {
    const start = turf.point(boundaryGeometry.coordinates[0]);
    const end = turf.point(opGeometry.coordinates);
    const linestring = turf.lineString(boundaryGeometry.coordinates);
    const sliced = lineSlice(start, end, linestring);
    return lineDistance(sliced);
};

function instanceOfObservationPoint(object: any): object is IObservationPoint {
    return true;
}

export default class LineBoundary extends Boundary {

    get observationPoints() {
        return this._observationPoints.map((op) => ObservationPoint.fromObject(op));
    }

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

    get geometryType() {
        return 'LineString';
    }

    get valueProperties(): IValueProperty[] {
        return [];
    }

    public static create(id: string, type: LineBoundaryType, geometry?: LineString, name?: string, layers?: number[],
                         cells?: ICells, spValues?: SpValues) {
        const boundary = new this(type);
        boundary._main.id = id;
        boundary._main.geometry = geometry;
        boundary._main.properties.name = name;
        boundary._main.properties.layers = layers;
        boundary._main.properties.cells = cells;

        if (spValues && geometry) {
            boundary.addObservationPoint(
                'OP1',
                {type: 'Point', coordinates: geometry.coordinates[0]},
                spValues
            );
        }

        return boundary;
    }

    public static fromObject(obj: ILineBoundary) {
        const features = obj.features;

        const main: ILineBoundaryFeature =
            features.filter((feature) =>
                feature.properties && feature.properties.type !== 'op')[0] as ILineBoundaryFeature;

        const boundary = this.create(
            main.id,
            main.properties.type,
            main.geometry,
            main.properties.name,
            main.properties.layers,
            main.properties.cells
        );

        const ops: Array<ILineBoundaryFeature | IObservationPoint> =
            features.filter((feature) => feature.properties.type === 'op');
        ops.forEach((op) => instanceOfObservationPoint(op) && boundary._observationPoints.push(op));
        return boundary;
    }

    // Todo: default boundary type
    private _main: ILineBoundaryFeature = {
        type: 'Feature',
        id: uuidv4(),
        geometry: {
            type: 'LineString',
            coordinates: [],
        },
        properties: {
            type: 'chd',
            name: '',
            layers: [],
            cells: []
        }
    };

    private _observationPoints: IObservationPoint[] = [];

    constructor(type: LineBoundaryType) {
        super();
        this._main.properties.type = type;
    }

    public addObservationPoint = (name: string, geometry: Point, spValues: SpValues) => {
        const op = ObservationPoint.create(Uuid.v4(), 'op', geometry, name, spValues,
            this.geometry ? distanceOnLine(this.geometry, geometry) : 0);
        this._observationPoints.push(op.toObject());
        this._observationPoints.sort((a, b) => {
            return ObservationPoint.fromObject(a).distance - ObservationPoint.fromObject(b).distance;
        });
    };

    public cloneObservationPoint = (id: string, newId: string) => {
        const op = ObservationPoint.fromObject(this.findObservationPointById(id));
        op.id = newId;
        this._observationPoints.push(op.toObject());
    };

    public updateObservationPoint = (id: string, name?: string, geometry?: Point, spValues?: SpValues) => {
        const op = ObservationPoint.fromObject(this.findObservationPointById(id));
        op.name = name;
        op.geometry = geometry;
        op.spValues = spValues;
        op.distance = this.geometry && geometry ? distanceOnLine(this.geometry, geometry) : 0;

        this._observationPoints = this._observationPoints.map((existingOp) => {
            if (op.id === existingOp.id) {
                return op.toObject();
            }

            return existingOp;
        });

        this._observationPoints.sort((a: IObservationPoint, b: IObservationPoint) =>
            ObservationPoint.fromObject(a).distance - ObservationPoint.fromObject(b).distance);
    };

    public removeObservationPoint = (opId: string) => {
        if (this._observationPoints.length === 1) {
            return;
        }
        this._observationPoints = this._observationPoints.filter((exitingOp) => opId !== exitingOp.id);
    };

    public findObservationPointByName = (name: string) => {
        const filtered = this._observationPoints.filter((op) => op.properties.name === name);
        if (filtered.length > 0) {
            return filtered[0];
        }

        throw new Error('ObservationPoint with name: ' + name + ' not found.');
    };

    public findObservationPointById = (id: string) => {
        const filtered = this._observationPoints.filter((op: IObservationPoint) => op.id === id);

        if (filtered.length > 0) {
            return filtered[0];
        }

        throw new Error('ObservationPoint with id: ' + id + ' not found.');
    };

    public getSpValues(opId: string) {
        const op = this.findObservationPointById(opId);
        return op === null ? null : op.properties.sp_values;
    }

    public setSpValues(spValues: SpValues, opId: string) {
        const op = this.findObservationPointById(opId);
        this.updateObservationPoint(opId, op.properties.name, op.geometry, spValues);
    }

    public toObject(): ILineBoundary {
        const obj: ILineBoundary = {
            type: 'FeatureCollection',
            features: []
        };

        obj.features.push(this._main);
        this._observationPoints.forEach((op) => obj.features.push(op));
        return obj;
    }
}
