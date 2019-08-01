import {Point} from 'geojson';
import uuidv4 from 'uuid/v4';
import {ICells} from '../../geometry/Cells.type';
import Boundary from './Boundary';
import {IHeadObservationWell} from './HeadObservationWell.type';
import {SpValues} from './types';

export default class HeadObservationWell extends Boundary {

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
        ];
    }

    public static create(id: string, type: 'hob', geometry?: Point, name?: string, layers?: number[], cells?: ICells,
                         spValues?: SpValues) {
        const boundary = new this();
        boundary._id = id;
        boundary._geometry = geometry;
        boundary._name = name;
        boundary._layers = layers;
        boundary._cells = cells;
        boundary._spValues = spValues;
        return boundary;
    }

    public static fromObject(obj: IHeadObservationWell) {
        return this.create(
            obj.id,
            obj.properties.type,
            obj.geometry,
            obj.properties.name,
            obj.properties.layers,
            obj.properties.cells,
            obj.properties.sp_values,
        );
    }

    public _type: 'hob' = 'hob';
    public _id: string = uuidv4();
    public _geometry?: Point;
    public _name?: string;
    public _layers?: number[];
    public _cells?: ICells;
    public _spValues?: SpValues;

    public getSpValues() {
        return this._spValues;
    }

    public setSpValues(spValues: SpValues, opId?: string) {
        this._spValues = spValues;
    }

    public toObject(): IHeadObservationWell {
        return {
            type: 'Feature',
            id: this.id,
            geometry: this.geometry,
            properties: {
                name: this.name,
                type: this.type,
                layers: this.layers,
                cells: this.cells,
                sp_values: this.getSpValues()
            }
        };
    }
}
