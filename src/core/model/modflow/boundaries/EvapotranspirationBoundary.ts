import {Polygon} from 'geojson';
import {cloneDeep} from 'lodash';
import Uuid from 'uuid';
import BoundingBox from '../../geometry/BoundingBox';
import {ICells} from '../../geometry/Cells.type';
import GridSize from '../../geometry/GridSize';
import {Cells, Geometry} from '../index';
import Boundary from './Boundary';
import {ISpValues, IValueProperty} from './Boundary.type';
import {
    IEvapotranspirationBoundary,
    IEvapotranspirationBoundaryExport,
    INevtop
} from './EvapotranspirationBoundary.type';

export default class EvapotranspirationBoundary extends Boundary {

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

    public static create(id: string, geometry: Polygon, name: string, layers: number[],
                         cells: ICells, spValues: ISpValues, nevtop: number = 1) {

        return new this({
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

    public static fromExport(obj: IEvapotranspirationBoundaryExport, boundingBox: BoundingBox, gridSize: GridSize) {
        return this.create(
            obj.id ? obj.id : Uuid.v4(),
            obj.geometry,
            obj.name,
            obj.layers,
            Cells.fromGeometry(Geometry.fromGeoJson(obj.geometry), boundingBox, gridSize).toObject(),
            obj.sp_values,
            obj.nevtop
        );
    }

    public static fromObject(obj: IEvapotranspirationBoundary) {
        return new this(obj);
    }

    public static geometryType() {
        return 'Polygon';
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

    constructor(props: IEvapotranspirationBoundary) {
        super();
        this._props = cloneDeep(props);
        this._class = EvapotranspirationBoundary;
    }

    public getSpValues() {
        return this._props.properties.sp_values;
    }

    public setSpValues(spValues: ISpValues, opId?: string) {
        this._props.properties.sp_values = spValues;
    }

    public toExport = (): IEvapotranspirationBoundaryExport => ({
        id: this.id,
        type: this.type,
        name: this.name,
        geometry: this.geometry.toObject() as Polygon,
        layers: this.layers,
        nevtop: this.nevtop ? this.nevtop : 1,
        sp_values: this.getSpValues()
    });

    public toObject(): IEvapotranspirationBoundary {
        return this._props;
    }

    public get valueProperties(): IValueProperty[] {
        return EvapotranspirationBoundary.valueProperties();
    }
}
