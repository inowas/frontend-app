import {MultiPolygon, Polygon} from 'geojson';
import uuidv4 from 'uuid/v4';
import {Cell} from '../../geometry/types';
import Boundary from './Boundary';
import {IEvapotranspirationBoundary} from './EvapotranspirationBoundary.type';
import {SpValues} from './types';

export default class EvapotranspirationBoundary extends Boundary {

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

    get nevtop() {
        return this._nevtop;
    }

    set nevtop(value) {
        this._nevtop = value;
    }

    get geometryType() {
        return 'Polygon';
    }

    get valueProperties() {
        return [
            {
                name: 'Max EVT',
                description: 'Maximum Evapotranspiration on flux',
                unit: 'm/day',
                decimals: 5,
                default: 0
            },
            {
                name: 'EVT Surface',
                description: 'Evapotranspiration of surface',
                unit: 'm',
                decimals: 5,
                default: 0
            },
            {
                name: 'Extinction Depth',
                description: 'Evapotranspiration on depth',
                unit: 'm',
                decimals: 5,
                default: 0
            }
        ];
    }

    public static create(id: string, type: 'evt', geometry?: Polygon | MultiPolygon, name?: string, layers?: number[],
                         cells?: Cell[], spValues?: SpValues, nevtop?: number) {
        const boundary = new this();
        boundary._id = id;
        boundary._geometry = geometry;
        boundary._name = name;
        boundary._layers = layers;
        boundary._cells = cells;
        boundary._spValues = spValues;
        boundary._nevtop = nevtop || 1;
        return boundary;
    }

    public static fromObject(obj: IEvapotranspirationBoundary) {
        return this.create(
            obj.id,
            obj.properties.type,
            obj.geometry,
            obj.properties.name,
            obj.properties.layers,
            obj.properties.cells,
            obj.properties.sp_values,
            obj.properties.nevtop
        );
    }

    private _type: 'evt' = 'evt';
    private _id: string = uuidv4();
    private _geometry?: Polygon | MultiPolygon;
    private _name?: string;
    private _layers?: number[];
    private _cells?: Cell[];
    private _nevtop: number = 1;
    private _spValues?: SpValues;

    public getSpValues() {
        return this._spValues;
    }

    public setSpValues(spValues: SpValues, opId?: string) {
        this._spValues = spValues;
    }

    public toObject(): IEvapotranspirationBoundary {
        return {
            type: 'Feature',
            id: this.id,
            geometry: this.geometry,
            properties: {
                name: this.name,
                type: this.type,
                layers: this.layers,
                cells: this.cells,
                nevtop: this.nevtop,
                sp_values: this.spValues
            }
        };
    }
}
