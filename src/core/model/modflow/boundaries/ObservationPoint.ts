import {Point} from 'geojson';
import uuidv4 from 'uuid/v4';
import {IObservationPoint} from './ObservationPoint.type';
import {SpValues} from './types';

export default class ObservationPoint {
    get type() {
        return this._type;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get distance() {
        return this._distance;
    }

    set distance(value) {
        this._distance = value;
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

    // noinspection JSMethodCanBeStatic
    get geometryType() {
        return 'Point';
    }

    public static create(id: string, type: 'op', geometry?: Point, name?: string, spValues?: SpValues,
                         distance: number = 0) {
        const op = new this();
        op.id = id;
        op.geometry = geometry;
        op.name = name;
        op.spValues = spValues;
        op.distance = distance;
        return op;
    }

    public static fromObject(obj: IObservationPoint) {
        return this.create(
            obj.id,
            obj.properties.type,
            obj.geometry,
            obj.properties.name,
            obj.properties.sp_values,
            obj.properties.distance,
        );
    }

    private _type: 'op' = 'op';
    private _id: string = uuidv4();
    private _name?: string;
    private _geometry?: Point;
    private _distance: number = 0;
    private _spValues?: SpValues;

    public getSpValues() {
        return this._spValues;
    }

    public setSpValues(spValues: SpValues) {
        this._spValues = spValues;
    }

    public toObject(): IObservationPoint {
        return {
            type: 'Feature',
            id: this.id,
            geometry: this.geometry,
            properties: {
                name: this.name,
                type: this.type,
                sp_values: this.spValues,
                distance: this.distance
            }
        };
    }
}
