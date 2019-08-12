import {Point} from 'geojson';
import {cloneDeep} from 'lodash';
import {ICells} from '../../geometry/Cells.type';
import {Cells, Geometry} from '../index';
import Boundary from './Boundary';
import {ISpValues, IValueProperty} from './Boundary.type';
import {IHeadObservationWell} from './HeadObservationWell.type';

export default class HeadObservationWell extends Boundary {

    public static geometryType() {
        return 'Point';
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
        this._props.geometry = value.toObject();
    }

    get geometryType() {
        return HeadObservationWell.geometryType();
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

    public static valueProperties(): IValueProperty[] {
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

    public static create(id: string, geometry: Point, name: string, layers: number[], cells: ICells,
                         spValues: ISpValues) {
        return new HeadObservationWell({
            id,
            type: 'Feature',
            geometry,
            properties: {
                type: 'hob',
                name,
                layers,
                cells,
                sp_values: spValues
            }
        });
    }

    constructor(props: IHeadObservationWell) {
        super();
        this._props = cloneDeep(props);
    }

    public getSpValues() {
        return this._props.properties.sp_values;
    }

    public setSpValues(spValues: ISpValues, opId?: string) {
        this._props.properties.sp_values = spValues;
    }

    public toObject(): IHeadObservationWell {
        return this._props;
    }

    public get valueProperties(): IValueProperty[] {
        return HeadObservationWell.valueProperties();
    }
}
