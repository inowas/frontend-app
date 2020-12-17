import {IStressPeriod, IStressPeriodWithTotim} from './Stressperiod.type';
import {IStressPeriods} from './Stressperiods.type';
import {ITimeUnit} from './TimeUnit.type';
import {TimeUnit} from './index';
import {orderBy} from 'lodash';
import Stressperiod from './Stressperiod';
import moment, {Moment} from 'moment/moment';

class Stressperiods {

    get startDateTime(): Moment {
        return moment.utc(this._props.start_date_time);
    }

    set startDateTime(value: Moment) {
        this._props.start_date_time = value.utc().toISOString();
    }

    get endDateTime(): Moment {
        return moment.utc(this._props.end_date_time);
    }

    set endDateTime(value: Moment) {
        this._props.end_date_time = value.utc().toISOString();
    }

    set stressperiods(stressperiods: Stressperiod[]) {
        stressperiods = Stressperiods.orderStressperiods(stressperiods);
        this._props.stressperiods = stressperiods.map((s) => s.toObject());
    }

    get stressperiods(): Stressperiod[] {
        const stressperiods = this._props.stressperiods.map((s) => new Stressperiod(s));
        return Stressperiods.orderStressperiods(stressperiods);
    }

    get count() {
        return this._props.stressperiods.length;
    }

    get dateTimes() {
        return this.stressperiods.map((sp) => sp.startDateTime);
    }

    get timeUnit(): TimeUnit {
        return TimeUnit.fromInt(this._props.time_unit);
    }

    set timeUnit(value: TimeUnit) {
        this._props.time_unit = value.toInt();
    }

    get totim() {
        if (this.timeUnit.toInt() === ITimeUnit.days) {
            return this.endDateTime.diff(this.startDateTime, 'days') + 1;
        }

        throw new Error(`TimeUnit ${this.timeUnit.toInt()} not implemented yet.`);
    }

    get perlens() {
        const totims = [];
        this.stressperiods.forEach((sp) => {
            totims.push(this.totimFromDate(sp.startDateTime));
        });

        totims.push(this.totimFromDate(this.endDateTime));

        const perlens = [];
        for (let i = 1; i < totims.length; i++) {
            perlens.push(totims[i] - totims[i - 1]);
        }

        return perlens;
    }

    get totims() {
        const totims = [];
        this.stressperiods.forEach((sp) => {
            totims.push(this.totimFromDate(sp.startDateTime));
        });

        totims.push(this.totimFromDate(this.endDateTime));
        return totims;
    }

    public static create(startDate: Moment, endDate: Moment, timeUnit: TimeUnit, stressperiods: Stressperiod[] = []) {
        const stressPeriods = new Stressperiods({
            start_date_time: startDate.toISOString(),
            end_date_time: endDate.toISOString(),
            time_unit: timeUnit.toInt(),
            stressperiods: stressperiods.map((s) => s.toObject())
        });

        if (stressperiods.length === 0) {
            stressPeriods.addStressPeriod(new Stressperiod({
                start_date_time: startDate.toISOString(),
                nstp: 1,
                tsmult: 1,
                steady: true
            }));
        }

        return stressPeriods;
    }

    public static fromDefaults() {
        return Stressperiods.create(moment.utc('2000-01-01'), moment.utc('2019-12-31'), TimeUnit.days());
    }

    public static fromObject(obj: IStressPeriods) {
        // UpCasting from IStressPeriodWithTotim
        let stressperiods: any = obj.stressperiods;
        stressperiods = stressperiods.map((sp: IStressPeriod | IStressPeriodWithTotim) => {
            if ('start_date_time' in sp) {
                return sp;
            }

            if ('totim_start' in sp) {
                return ({
                    start_date_time: Stressperiods.dateTimeFromTotim(
                        moment(obj.start_date_time), sp.totim_start, TimeUnit.fromInt(obj.time_unit)
                    ),
                    nstp: sp.nstp,
                    tsmult: sp.tsmult,
                    steady: sp.steady
                });
            }

            return sp;
        });

        obj.stressperiods = stressperiods;
        return new Stressperiods(obj);
    }

    public static fromImport(obj: IStressPeriods) {
        return Stressperiods.fromObject(obj);
    }

    public static dateTimeFromTotim(startDateTime: Moment, totim: number, timeUnit: TimeUnit) {
        if (timeUnit.toInt() === ITimeUnit.days) {
            return moment.utc(startDateTime).add(totim, 'days').format();
        }

        throw new Error(`TimeUnit ${timeUnit.toInt()} not implemented yet.`);
    }

    public static orderStressperiods(stressperiods: Stressperiod[]) {
        return orderBy(stressperiods, [(sp) => sp.startDateTime], ['asc']);
    }

    private readonly _props: IStressPeriods;

    constructor(props: IStressPeriods) {
        this._props = props;
    }

    public getStressperiodByIdx(idx: number) {
        return this.stressperiods[idx];
    }

    public get first() {
        let first = this.stressperiods[0];
        this.stressperiods.forEach((sp) => {
            if (sp.startDateTime.isBefore(first.startDateTime)) {
                first = sp;
            }
        });
        return first;
    }

    public last() {
        return this.stressperiods[this.count - 1];
    }

    public updateStressperiodByIdx(idx: number, stressperiod: Stressperiod) {
        const stressperiods = this.stressperiods;
        stressperiods[idx] = stressperiod;
        this.stressperiods = stressperiods;
    }

    public addStressPeriod(stressperiod: Stressperiod) {
        const stressperiods = this.stressperiods;
        stressperiods.push(stressperiod);
        this.stressperiods = Stressperiods.orderStressperiods(stressperiods);
    }

    public removeStressPeriod(id: number) {
        const stressperiods: Stressperiod[] = [];
        this.stressperiods.forEach((sp, idx) => {
            if (id !== idx) {
                stressperiods.push(sp);
            }
        });

        this.stressperiods = stressperiods;
    }

    public updateStressPeriodsByStartDateTime() {
        const firstStressPeriod = this.first;
        const difference = moment.duration(this.startDateTime.diff(firstStressPeriod.startDateTime)).asDays();

        this.stressperiods = this.stressperiods.map((sp) => {
            sp.startDateTime = sp.startDateTime.add(difference, 'days');
            return sp;
        });
        return this;
    }

    public toCsv = () => {
        let text = 'start_date_time;nstp;tsmult;steady\n';
        this.stressperiods.forEach((sp) => {
            text += (`${sp.startDateTime.format('YYYY-MM-DD')};${sp.nstp};${sp.tsmult};${sp.steady ? 1 : 0}\n`);
        });
        text += (`${this.endDateTime.format('YYYY-MM-DD')};;;`);
        return text;
    };

    public toObject = () => {
        return this._props;
    };

    public totimFromDate(dateTime: Moment) {
        if (this.timeUnit.toInt() === ITimeUnit.days) {
            return dateTime.diff(this.startDateTime, 'days', true);
        }

        throw new Error(`TimeUnit ${this.timeUnit.toInt()} not implemented yet.`);
    }
}

export default Stressperiods;
