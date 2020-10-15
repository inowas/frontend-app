import {Point} from 'geojson';
import {cloneDeep} from 'lodash';
import moment, {Moment} from 'moment';
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

    get dateTimes() {
        if (!this._props.properties.date_times) {
            return undefined;
        }
        return this._props.properties.date_times.map((dt: string) => moment.utc(dt));
    }

    set dateTimes(value: Moment[] | undefined) {
        if (value) {
            this._props.properties.date_times = value.map((dt) => dt.format('YYYY-MM-DD'));
            return;
        }

        this._props.properties.date_times = value;
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

    public static create(id: string, type: 'op', geometry: Point, name: string,
                         spValues: ISpValues, distance = 0, dateTimes?: string[]) {
        return new ObservationPoint({
            type: 'Feature',
            id,
            geometry,
            properties: {
                name,
                type: 'op',
                date_times: dateTimes,
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
            obj.properties.date_times
        );
    }

    private _props: IObservationPoint;

    public constructor(props: IObservationPoint) {
        this._props = cloneDeep(props);
    }

    public addDateTimeValue(datetime: Moment, value: number[]) {
        if (this._props.properties.date_times) {
            this._props.properties.date_times.push(datetime.utc().format('YYYY-MM-DD'));
        } else {
            this._props.properties.date_times = [datetime.utc().format('YYYY-MM-DD')];
        }
        this._props.properties.sp_values.push(value);
        return this;
    }

    public updateDateTime(idx: number, datetime: Moment) {
        if (this._props.properties.date_times && this._props.properties.date_times.length > idx) {
            this._props.properties.date_times[idx] = datetime.utc().format('YYYY-MM-DD');
        }
        return this;
    }

    public getDateTimes(stressPeriods: Stressperiods) {
        if (!this._props.properties.date_times) {
            return stressPeriods.stressperiods.map((sp) => sp.startDateTime);
        }

        return this._props.properties.date_times.map((dt: string) => moment.utc(dt));
    }

    public getSpValues(stressperiods: Stressperiods) {
        const spValues = this._props.properties.sp_values;
        if (this.getDateTimes(stressperiods).length > 0) {
            return this.getDateTimes(stressperiods).map((dt, idx) => {
                if (Array.isArray(spValues[idx])) {
                    return spValues[idx];
                }
                return spValues[spValues.length - 1];
            });
        }
        return Boundary.mergeStressperiodsWithSpValues(stressperiods, spValues);
    }

    public toObject(): IObservationPoint {
        return cloneDeep({
            type: 'Feature',
            id: this.id,
            geometry: this.geometry,
            properties: {
                name: this.name,
                type: this.type,
                date_times: this._props.properties.date_times,
                sp_values: this.spValues,
                distance: this.distance
            }
        });
    }
}
