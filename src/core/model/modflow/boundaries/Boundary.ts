import _ from 'lodash';
import moment, {DurationInputArg1, DurationInputArg2, Moment} from 'moment';
import Uuid from 'uuid';
import {Cells, Geometry} from '../index';
import Stressperiods from '../Stressperiods';
import {
    BoundaryType,
    IBoundary,
    IBoundaryExport,
    ISpValues,
    IValueProperty
} from './Boundary.type';

export default abstract class Boundary {

    abstract get type(): BoundaryType;

    abstract get id(): string;

    abstract set id(id: string);

    public get dateTimes() {
        if (!this._props.properties || !this._props.properties.date_times) {
            return [];
        }
        return this._props.properties.date_times.map((dt: string) => moment.utc(dt));
    }

    public set dateTimes(value: Moment[]) {
        this._props.properties.date_times = value.map((dt) => dt.format('YYYY-MM-DD'));
    }

    abstract get geometry(): Geometry;

    abstract get name(): string;

    abstract set name(name: string);

    abstract get cells(): Cells;

    abstract get layers(): number[];

    get geometryType() {
        return this._class.geometryType();
    }

    abstract get valueProperties(): IValueProperty[];

    public static mergeStressperiodsWithSpValues = (stressperiods: Stressperiods, spValues: ISpValues): ISpValues => {
        return stressperiods.stressperiods.map((sp, idx) => {
            if (Array.isArray(spValues[idx])) {
                return spValues[idx];
            }
            return spValues[spValues.length - 1];
        });
    };

    protected _props: any;

    protected _class: any;

    public getDateTimes = () => {
        return this.dateTimes;
    };

    public abstract getSpValues(stressPeriods: Stressperiods, opId?: string): ISpValues;

    public abstract setSpValues(spValues: ISpValues, opId?: string): void;

    public abstract toExport(stressPeriods: Stressperiods): IBoundaryExport;

    public abstract toObject(): IBoundary;

    /*public sameAs(b: Boundary): boolean {
        return isEqual(simpleDiff(this.toExport(), b.toExport()), {});
    }*/

    public addDateTime(amount: DurationInputArg1, unit: DurationInputArg2) {
        const dateTimes = this._props.properties.date_times;
        if (this._props.properties.date_times.length > 0) {
            const newDateTime = moment.utc(dateTimes[dateTimes.length - 1]).add(amount, unit);
            this._props.properties.date_times.push(newDateTime.format('YYYY-MM-DD'));
            return this;
        }
        this._props.properties.date_times.push(moment().format('YYYY-MM-DD'));
        return this;
    }

    public changeDateTime(value: string, idx: number) {
        if (this._props.properties.date_times.length > idx) {
            this._props.properties.date_times[idx] = value;
        }
        return this.reorderDateTimes();
    }

    public removeDateTime(id: number) {
        const dateTimes: string[] = [];
        this._props.properties.date_times.forEach((dt: string, idx: number) => {
            if (id !== idx) {
                dateTimes.push(dt);
            }
        });
        this._props.properties.date_times = dateTimes;
        return this;
    }

    public reorderDateTimes() {
        this.dateTimes = _.orderBy(this.dateTimes, (o: Moment) => {
            return o.format('YYYYMMDD');
        }, ['asc']);
        return this;
    }

    public clone() {
        const b = this._class.fromObject(this._props);
        b.id = Uuid.v4();
        b.name = this.name + ' (clone)';
        return b;
    }
}
