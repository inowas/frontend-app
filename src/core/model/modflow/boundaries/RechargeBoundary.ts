import {MultiPolygon, Polygon} from 'geojson';
import uuidv4 from 'uuid/v4';
import {Cell} from '../../geometry/types';
import Boundary from './Boundary';
import {IRechargeBoundary} from './RechargeBoundary.type';
import {SpValues} from './types';

export default class RechargeBoundary extends Boundary {

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

    get geometryType() {
        return 'Polygon';
    }

    get nrchop(): number {
        return this._nrchop;
    }

    set nrchop(value: number) {
        this._nrchop = value;
    }

    get valueProperties() {
        return [
            {
                name: 'Recharge rate',
                description: 'Recharge rate into layer',
                unit: 'm/day',
                decimals: 5,
                default: 0
            },
        ];
    }

    public static create(id: string, type: 'rch', geometry?: Polygon | MultiPolygon, name?: string, layers?: number[],
                         cells?: Cell[], spValues?: SpValues, nrchop?: number) {
        const boundary = new this();
        boundary._id = id;
        boundary._geometry = geometry;
        boundary._name = name;
        boundary._layers = layers;
        boundary._cells = cells;
        boundary._spValues = spValues;
        boundary._nrchop = nrchop || 1;
        return boundary;
    }

    public static fromObject(obj: IRechargeBoundary) {
        return this.create(
            obj.id,
            obj.properties.type,
            obj.geometry,
            obj.properties.name,
            obj.properties.layers,
            obj.properties.cells,
            obj.properties.sp_values,
            obj.properties.nrchop
        );
    }

    public _type: 'rch' = 'rch';
    public _id: string = uuidv4();
    public _geometry?: Polygon | MultiPolygon;
    public _name?: string;
    public _layers?: number[];
    public _cells?: Cell[];
    public _spValues?: SpValues;
    public _nrchop: number = 1;

    public getSpValues() {
        return this._spValues;
    }

    public setSpValues(spValues: SpValues, opId?: string) {
        this._spValues = spValues;
    }

    public toObject(): IRechargeBoundary {
        return {
            type: 'Feature',
            id: this.id,
            geometry: this.geometry,
            properties: {
                name: this.name,
                type: this.type,
                layers: this.layers,
                cells: this.cells,
                nrchop: this.nrchop,
                sp_values: this.spValues
            }
        };
    }
}
