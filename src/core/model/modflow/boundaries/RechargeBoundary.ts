import {Polygon} from 'geojson';
import {cloneDeep} from 'lodash';
import Uuid from 'uuid';
import BoundingBox from '../../geometry/BoundingBox';
import {ICells} from '../../geometry/Cells.type';
import GridSize from '../../geometry/GridSize';
import {Cells, Geometry} from '../index';
import Stressperiods from '../Stressperiods';
import {ISpValues, IValueProperty} from './Boundary.type';
import {Boundary} from './index';
import {INrchop, IRechargeBoundary, IRechargeBoundaryExport} from './RechargeBoundary.type';

export default class RechargeBoundary extends Boundary {

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
        return Cells.fromObject(this._props.properties.cells);
    }

    set cells(value) {
        this._props.properties.cells = value.toObject();
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

    public static geometryType() {
        return 'Polygon';
    }

    public static fromExport(obj: IRechargeBoundaryExport, boundingBox: BoundingBox, gridSize: GridSize) {
        return this.create(
            obj.id ? obj.id : Uuid.v4(),
            obj.geometry,
            obj.name,
            obj.layers,
            Cells.fromGeometry(Geometry.fromGeoJson(obj.geometry), boundingBox, gridSize).toObject(),
            obj.sp_values,
            obj.nrchop
        );
    }

    public static fromObject(obj: IRechargeBoundary) {
        return new this(obj);
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
                         layers: number[], cells: ICells, spValues: ISpValues, nrchop: INrchop = 1) {

        return new this({
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
        this._class = RechargeBoundary;
    }

    public getSpValues(stressPeriods: Stressperiods) {
        return stressPeriods.getSpValues(this._props.properties.sp_values);
    }

    public setSpValues(spValues: ISpValues, opId?: string) {
        this._props.properties.sp_values = spValues;
    }

    public toExport = (stressPeriods: Stressperiods): IRechargeBoundaryExport => ({
        id: this.id,
        type: this.type,
        name: this.name,
        geometry: this.geometry.toObject() as Polygon,
        layers: this.layers,
        nrchop: this.nrchop ? this.nrchop : 1,
        sp_values: this.getSpValues(stressPeriods)
    });

    public toObject(): IRechargeBoundary {
        return this._props;
    }

    public get valueProperties(): IValueProperty[] {
        return RechargeBoundary.valueProperties();
    }
}
