import {Point} from 'geojson';
import {cloneDeep} from 'lodash';
import Stressperiods from '../Stressperiods';
import Boundary from './Boundary';
import {ISpValues} from './Boundary.type';
import {IObservationPoint} from './ObservationPoint.type';

export default class ObservationPoint {
    get type() {
        return this._props.properties.type;
    }

    get id() {
        return this._props.id;
    }

    set id(value) {
        this._props.id = value;
    }

    get distance() {
        return this._props.properties.distance;
    }

    set distance(value) {
        this._props.properties.distance = value;
    }

    get geometry() {
        return this._props.geometry;
    }

    set geometry(value) {
        this._props.geometry = value;
    }

    get name() {
        return this._props.properties.name;
    }

    set name(value) {
        this._props.properties.name = value;
    }

    get spValues() {
        return this._props.properties.sp_values;
    }

    set spValues(value) {
        this._props.properties.sp_values = value;
    }

    // noinspection JSMethodCanBeStatic
    get geometryType() {
        return 'Point';
    }

    public static create(id: string, type: 'op', geometry: Point, name: string, spValues: ISpValues,
                         distance: number = 0) {
        return new ObservationPoint({
            type: 'Feature',
            id,
            geometry,
            properties: {
                name,
                type: 'op',
                sp_values: spValues,
                distance
            }
        });
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

    private _props: IObservationPoint;

    public constructor(props: IObservationPoint) {
        this._props = cloneDeep(props);
    }

    public getSpValues(stressperiods: Stressperiods) {
        return Boundary.mergeStressperiodsWithSpValues(stressperiods, this._props.properties.sp_values);
    }

    public setSpValues(spValues: ISpValues) {
        this._props.properties.sp_values = spValues;
    }

    public toObject(): IObservationPoint {
        return cloneDeep({
            type: 'Feature',
            id: this.id,
            geometry: this.geometry,
            properties: {
                name: this.name,
                type: this.type,
                sp_values: this.spValues,
                distance: this.distance
            }
        });
    }
}
