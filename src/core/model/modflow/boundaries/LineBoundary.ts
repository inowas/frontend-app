import * as turf from '@turf/helpers';
import {Boundary, ObservationPoint} from './index';
import {Cells, Geometry} from '../index';
import {IConstantHeadBoundaryFeature} from './ConstantHeadBoundary.type';
import {IObservationPoint} from './ObservationPoint.type';
import {ISpValues} from './Boundary.type';
import {LineString, Point} from 'geojson';
import {lineDistance, lineSlice} from '@turf/turf';
import BoundingBox from '../../geometry/BoundingBox';
import GridSize from '../../geometry/GridSize';
import Stressperiods from '../Stressperiods';
import moment, {Moment} from 'moment';

const distanceOnLine = (boundaryGeometry: LineString, opGeometry: Point) => {
    const start = turf.point(boundaryGeometry.coordinates[0]);
    const end = turf.point(opGeometry.coordinates);
    const linestring = turf.lineString(boundaryGeometry.coordinates);
    const sliced = lineSlice(start, end, linestring);
    return lineDistance(sliced);
};

export default abstract class LineBoundary extends Boundary {

    public static geometryType() {
        return 'LineString';
    }

    get type() {
        let type: any;
        this._props.features.forEach((f: IObservationPoint | IConstantHeadBoundaryFeature) => {
            if (f.properties.type !== 'op') {
                type = f.properties.type;
            }
        });

        if (type) {
            return type;
        }

        throw new Error('Main feature not available.');
    }

    get id(): string {
        let id: any;
        this._props.features.forEach((f: IObservationPoint | IConstantHeadBoundaryFeature) => {
            if (f.properties.type !== 'op') {
                id = f.id;
            }
        });

        if (id) {
            return id;
        }

        throw new Error('Main feature not available.');
    }

    set id(value) {
        this._props.features.forEach((f: IObservationPoint | IConstantHeadBoundaryFeature) => {
            if (f.properties.type !== 'op') {
                f.id = value;
            }
        });
    }

    get name(): string {
        let name: any;
        this._props.features.forEach((f: IObservationPoint | IConstantHeadBoundaryFeature) => {
            if (f.properties.type !== 'op') {
                name = f.properties.name;
            }
        });

        if (name) {
            return name;
        }

        throw new Error('Main feature not available.');
    }

    set name(value) {
        this._props.features.forEach((f: IObservationPoint | IConstantHeadBoundaryFeature) => {
            if (f.properties.type !== 'op') {
                f.properties.name = value;
            }
        });
    }

    get cells(): Cells {
        let cells;
        this._props.features.forEach((f: IObservationPoint | IConstantHeadBoundaryFeature) => {
            if (f.properties.type !== 'op') {
                cells = Cells.fromObject(f.properties.cells);
            }
        });

        if (cells) {
            return cells;
        }

        throw new Error('Main feature not available.');
    }

    set cells(value) {
        this._props.features.forEach((f: IObservationPoint | IConstantHeadBoundaryFeature) => {
            if (f.properties.type !== 'op') {
                f.properties.cells = value.toObject();
            }
        });
    }

    get layers(): number[] {
        let layers: any;
        this._props.features.forEach((f: IObservationPoint | IConstantHeadBoundaryFeature) => {
            if (f.properties.type !== 'op') {
                layers = f.properties.layers;
            }
        });

        if (layers) {
            return layers;
        }

        throw new Error('Main feature not available.');
    }

    set layers(value) {
        this._props.features.forEach((f: IObservationPoint | IConstantHeadBoundaryFeature) => {
            if (f.properties.type !== 'op') {
                f.properties.layers = value;
            }
        });
    }

    get geometry(): Geometry {
        let geometry;
        this._props.features.forEach((f: IObservationPoint | IConstantHeadBoundaryFeature) => {
            if (f.properties.type !== 'op') {
                geometry = Geometry.fromObject(f.geometry as LineString);
            }
        });

        if (geometry) {
            return geometry;
        }

        throw new Error('Main feature not available.');
    }

    set geometry(value) {
        this._props.features.forEach((f: IObservationPoint | IConstantHeadBoundaryFeature) => {
            if (f.properties.type !== 'op') {
                f.geometry = value.toObject() as LineString;
            }
        });
    }

    get geometryType(): string {
        return LineBoundary.geometryType();
    }

    get observationPoints(): ObservationPoint[] {
        const opObj = this._props.features.filter(
            (f: IObservationPoint | IConstantHeadBoundaryFeature) =>
                (f.properties.type === 'op')) as IObservationPoint[];
        return opObj.map((o) => ObservationPoint.fromObject(o));
    }

    set observationPoints(ops) {
        const b = this._props.features.filter(
            (f: IObservationPoint | IConstantHeadBoundaryFeature) =>
                (f.properties.type !== 'op')) as IConstantHeadBoundaryFeature[];

        let features: any = [];
        features = features.concat(b);
        ops.sort((o1, o2) => {
            return (o1.distance - o2.distance);
        });
        this._props.features = features.concat(ops.map((op) => op.toObject()));
    }

    public getSpValues(stressperiods: Stressperiods, opId?: string): ISpValues {
        if (opId) {
            const observationPoint = this.findObservationPointById(opId);
            return observationPoint.getSpValues(stressperiods);
        }
        return [];
    }

    public setSpValues(spValues: ISpValues, opId?: string) {
        this._props.features.forEach((f: IObservationPoint | IConstantHeadBoundaryFeature) => {
            if (f.properties.type === 'op' && f.id === opId) {
                f.properties.sp_values = spValues;
            }
        });
    }

    public createObservationPoint = (newId: string, name: string, geometry: Point,
                                     spValues: ISpValues, dateTimes?: string[]) => {
        const ops = this.observationPoints;
        ops.push(
            ObservationPoint.create(newId, 'op', geometry, name, spValues,
                distanceOnLine(this.geometry as LineString, geometry), dateTimes
            )
        );

        this.observationPoints = ops;
    };

    public cloneObservationPoint = (id: string, newId: string, stressperiods: Stressperiods) => {
        const op = ObservationPoint.fromObject(this.findObservationPointById(id).toObject());
        this.createObservationPoint(
            newId,
            op.name + ' (clone)',
            op.geometry as Point,
            op.getSpValues(stressperiods),
            op.dateTimes && op.dateTimes.map((dt) => dt.format('YYYY-MM-DD'))
        );
    };

    public findObservationPointById = (id: string) => {
        const filtered = this.observationPoints.filter((op: ObservationPoint) => op.id === id);

        if (filtered.length > 0) {
            return filtered[0];
        }

        throw new Error('ObservationPoint with id: ' + id + ' not found.');
    };

    public findObservationPointByName = (name: string) => {
        const filtered = this.observationPoints.filter((op) => op.name === name);

        if (filtered.length > 0) {
            return filtered[0];
        }

        throw new Error('ObservationPoint with name: ' + name + ' not found.');
    };

    public removeObservationPoint = (opId: string) => {
        if (this.observationPoints.length === 1) {
            return;
        }
        this.observationPoints = this.observationPoints.filter((existingOp) => opId !== existingOp.id);
    };

    public updateDateTimeValues = (id: string, spValues: ISpValues, dateTimes: string[]) => {
        this.observationPoints = this.observationPoints.map((op) => {
            if (op.id === id) {
                op.dateTimes = dateTimes.map((dt) => moment.utc(dt));
                op.spValues = spValues;
            }
            return op;
        });
    };

    public updateObservationPoint = (id: string, name: string, geometry: Point, spValues: ISpValues,
                                     dateTimes?: Moment[]) => {
        this.observationPoints = this.observationPoints.map((op) => {
            if (op.id === id) {
                op.name = name;
                op.geometry = geometry;
                op.spValues = spValues;
                if (op.dateTimes && dateTimes) {
                    op.dateTimes = dateTimes;
                }
                op.distance = distanceOnLine(this.geometry as LineString, geometry);
            }
            return op;
        });
    };

    public recalculateCells = (boundingBox: BoundingBox, gridSize: GridSize) => {
        const cells = Cells.fromGeometry(this.geometry, boundingBox, gridSize);
        this.observationPoints = this.observationPoints.map((op) => {
            op.distance = distanceOnLine(this.geometry as LineString, op.geometry);
            return op;
        });

        cells.calculateValues(this, boundingBox, gridSize);
        this.cells = cells;
    };

    public recalculateCellValues = (boundingBox: BoundingBox, gridSize: GridSize) => {
        const cells = this.cells;
        cells.calculateValues(this, boundingBox, gridSize);
        this.cells = cells;
    };
}
