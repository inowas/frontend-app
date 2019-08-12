import {Polygon} from 'geojson';
import {cloneDeep} from 'lodash';
import {ICells} from '../../geometry/Cells.type';
import {Geometry} from '../index';
import Boundary from './Boundary';
import {ISpValues, IValueProperty} from './Boundary.type';
import {IEvapotranspirationBoundary, INevtop} from './EvapotranspirationBoundary.type';

export default class EvapotranspirationBoundary extends Boundary {

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
        return EvapotranspirationBoundary.geometryType();
    }

    get nevtop() {
        return this._props.properties.nevtop;
    }

    set nevtop(value) {
        this._props.properties.nevtop = value;
    }

    get optionCode(): INevtop {
        return this.nevtop;
    }

    set optionCode(value: INevtop) {
        this.nevtop = value;
    }

    public static valueProperties() {
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

    public static create(id: string, geometry: Polygon, name: string, layers: number[],
                         cells: ICells, spValues: ISpValues, nevtop: number) {

        return new EvapotranspirationBoundary({
            id,
            type: 'Feature',
            geometry,
            properties: {
                type: 'evt',
                name,
                cells,
                layers,
                sp_values: spValues,
                nevtop,
            }
        });
    }

    constructor(props: IEvapotranspirationBoundary) {
        super();
        this._props = cloneDeep(props);
    }

    public getSpValues() {
        return this._props.properties.sp_values;
    }

    public setSpValues(spValues: ISpValues, opId?: string) {
        this._props.properties.sp_values = spValues;
    }

    public toObject(): IEvapotranspirationBoundary {
        return this._props;
    }

    public get valueProperties(): IValueProperty[] {
        return EvapotranspirationBoundary.valueProperties();
    }
}
