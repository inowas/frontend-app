import {Point} from 'geojson';
import _, {cloneDeep} from 'lodash';
import moment, {DurationInputArg1, DurationInputArg2, Moment} from 'moment';
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
            this._props.properties.date_times = [];
        }
        return this._props.properties.date_times.map((dt: string) => moment.utc(dt));
    }

    set dateTimes(value: Moment[]) {
        this._props.properties.date_times = value.map((dt) => dt.format('YYYY-MM-DD'));
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
                         spValues: ISpValues, distance: number = 0, dateTimes?: string[]) {
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

    public getSpValues(stressperiods: Stressperiods) {
        const spValues = this._props.properties.sp_values;
        if (this.dateTimes.length > 0) {
            return this.dateTimes.map((dt, idx) => {
                if (Array.isArray(spValues[idx])) {
                    return spValues[idx];
                }
                return spValues[spValues.length - 1];
            });
        }
        return Boundary.mergeStressperiodsWithSpValues(stressperiods, spValues);
    }

    public setSpValues(spValues: ISpValues) {
        this._props.properties.sp_values = spValues;
    }

    public addDateTime(amount: DurationInputArg1, unit: DurationInputArg2) {
        const dateTimes = this._props.properties.date_times;
        if (dateTimes) {
            if (dateTimes.length > 0) {
                const newDateTime = moment.utc(dateTimes[dateTimes.length - 1]).add(amount, unit);
                dateTimes.push(newDateTime.format('YYYY-MM-DD'));
                this._props.properties.date_times = dateTimes;
                return this;
            }
            dateTimes.push(moment().format('YYYY-MM-DD'));
            this._props.properties.date_times = dateTimes;
        }
        return this;
    }

    public changeDateTime(value: string, idx: number) {
        if (this._props.properties.date_times && this._props.properties.date_times.length > idx) {
            this._props.properties.date_times[idx] = value;
        }
        return this.reorderDateTimes();
    }

    public removeDateTime(id: number) {
        const dateTimes: string[] = [];
        if (this._props.properties.date_times) {
            this._props.properties.date_times.forEach((dt: string, idx: number) => {
                if (id !== idx) {
                    dateTimes.push(dt);
                }
            });
            this._props.properties.date_times = dateTimes;
        }
        return this;
    }

    public reorderDateTimes() {
        this.dateTimes = _.orderBy(this.dateTimes, (o: Moment) => {
            return o.format('YYYYMMDD');
        }, ['asc']);
        return this;
    }

    public toObject(): IObservationPoint {
        return cloneDeep({
            type: 'Feature',
            id: this.id,
            geometry: this.geometry,
            properties: {
                name: this.name,
                type: this.type,
                date_times: this.dateTimes.map((dt) => dt.format('YYYY-MM-DD')),
                sp_values: this.spValues,
                distance: this.distance
            }
        });
    }
}
