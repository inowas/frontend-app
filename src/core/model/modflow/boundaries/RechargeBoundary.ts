import {Polygon} from 'geojson';
import {cloneDeep} from 'lodash';
import {ICells} from '../../geometry/Cells.type';
import {Geometry} from '../index';
import {ISpValues, IValueProperty} from './Boundary.type';
import {Boundary} from './index';
import {INrchop, IRechargeBoundary} from './RechargeBoundary.type';

export default class RechargeBoundary extends Boundary {

    public static geometryType() {
        return 'Polygon';
    }

    get type() {
        return this._props.properties.type;
    }

    get id() {
        return this._props.id;
    }

    set id(value) {
        this._props.id = value;
    }

    get geometry() {
        return Geometry.fromObject(this._props.geometry);
    }

    set geometry(value) {
        this._props.geometry = value.toObject() as Polygon;
    }

    get name() {
        return this._props.properties.name;
    }

    set name(value) {
        this._props.properties.name = value;
    }

    get layers() {
        return this._props.properties.layers;
    }

    set layers(value) {
        this._props.properties.layers = value;
    }

    get cells() {
        return this._props.properties.cells;
    }

    set cells(value) {
        this._props.properties.cells = value;
    }

    get geometryType() {
        return RechargeBoundary.geometryType();
    }

    get nrchop(): INrchop {
        return this._props.properties.nrchop;
    }

    set nrchop(value: INrchop) {
        this._props.properties.nrchop = value;
    }

    get optionCode(): INrchop {
        return this._props.properties.nrchop;
    }

    set optionCode(value: INrchop) {
        this._props.properties.nrchop = value;
    }

    public static valueProperties(): IValueProperty[] {
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

    public static create(id: string, geometry: Polygon, name: string,
                         layers: number[], cells: ICells, spValues: ISpValues, nrchop: INrchop) {

        return new RechargeBoundary({
            id,
            type: 'Feature',
            geometry,
            properties: {
                type: 'rch',
                name,
                cells,
                layers,
                sp_values: spValues,
                nrchop,
            }
        });
    }

    constructor(props: IRechargeBoundary) {
        super();
        this._props = cloneDeep(props);
    }

    public getSpValues() {
        return this._props.properties.sp_values;
    }

    public setSpValues(spValues: ISpValues, opId?: string) {
        this._props.properties.sp_values = spValues;
    }

    public toObject(): IRechargeBoundary {
        return this._props;
    }

    public get valueProperties(): IValueProperty[] {
        return RechargeBoundary.valueProperties();
    }
}
