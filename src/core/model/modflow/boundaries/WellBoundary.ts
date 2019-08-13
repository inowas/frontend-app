import {Point} from 'geojson';
import {cloneDeep} from 'lodash';
import Uuid from 'uuid';
import BoundingBox from '../../geometry/BoundingBox';
import {ICells} from '../../geometry/Cells.type';
import GridSize from '../../geometry/GridSize';
import {Cells, Geometry} from '../index';
import Boundary from './Boundary';
import {ISpValues, IValueProperty} from './Boundary.type';
import {IWellBoundary, IWellBoundaryImport, IWellType} from './WellBoundary.type';

export default class WellBoundary extends Boundary {

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
        this._props.geometry = value.toObject();
    }

    get geometryType() {
        return WellBoundary.geometryType();
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
        this._props.properties.cells = value.toObject;
    }

    get wellType() {
        return this._props.properties.well_type;
    }

    set wellType(value) {
        this._props.properties.well_type = value;
    }

    public static create(id: string, geometry: Point, name: string, layers: number[], cells: ICells,
                         spValues: ISpValues) {
        return new this({
            id,
            type: 'Feature',
            geometry,
            properties: {
                type: 'wel',
                name,
                cells,
                layers,
                well_type: WellBoundary.wellTypes.default as IWellType,
                sp_values: spValues
            }
        });
    }

    public static fromImport(obj: IWellBoundaryImport, boundingBox: BoundingBox, gridSize: GridSize) {
        const boundary = this.create(
            obj.id ? obj.id : Uuid.v4(),
            obj.geometry,
            obj.name,
            obj.layers,
            Cells.fromGeometry(Geometry.fromGeoJson(obj.geometry), boundingBox, gridSize).toObject(),
            obj.sp_values
        );

        boundary.wellType = obj.well_type;
        return boundary;
    }

    public static fromObject(obj: IWellBoundary) {
        return new this(obj);
    }

    public static geometryType() {
        return 'Point';
    }

    public static valueProperties(): IValueProperty[] {
        return [
            {
                name: 'Pumping rate',
                description: 'Pumping rate of the well, positive values = infiltration',
                unit: 'm³/day',
                decimals: 1,
                default: 0
            },
        ];
    }

    static get wellTypes() {
        return {
            default: 'puw',
            types: [
                {
                    name: 'Public Well',
                    value: 'puw'
                },
                {
                    name: 'Infiltration Well',
                    value: 'inw'
                },
                {
                    name: 'Industrial Well',
                    value: 'iw'
                },
                {
                    name: 'Irrigation Well',
                    value: 'irw'
                },
                {
                    name: 'Optimized Well',
                    value: 'opw'
                }
            ]
        };
    }

    constructor(props: IWellBoundary) {
        super();
        this._props = cloneDeep(props);
    }

    public getSpValues() {
        return this._props.properties.sp_values;
    }

    public setSpValues(spValues: ISpValues, opId?: string) {
        this._props.properties.sp_values = spValues;
    }

    public toImport = (): IWellBoundaryImport => ({
        id: this.id,
        type: this.type,
        name: this.name,
        geometry: this.geometry.toObject() as Point,
        layers: this.layers,
        well_type: this.wellType,
        sp_values: this.getSpValues()
    });

    public toObject(): IWellBoundary {
        return this._props;
    }

    public get valueProperties(): IValueProperty[] {
        return WellBoundary.valueProperties();
    }
}
