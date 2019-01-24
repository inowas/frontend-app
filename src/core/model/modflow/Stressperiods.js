import moment from 'moment/moment';
import Stressperiod from './Stressperiod';
import {orderBy} from 'lodash';
import {TimeUnit} from './index';

const dateToString = (date) => moment.utc(date).format('YYYY-MM-DD');

class Stressperiods {

    _startDateTime = null;
    _endDateTime = null;
    _stressperiods = [];
    _timeUnit;

    static create(startDate, endDate, timeUnit) {
        const stressPeriods = new Stressperiods();
        stressPeriods.startDateTime = moment.utc(startDate);
        stressPeriods.endDateTime = moment.utc(endDate);
        stressPeriods.timeUnit = (timeUnit instanceof TimeUnit) ? timeUnit.toInt() : timeUnit;
        stressPeriods.addStressPeriod(Stressperiod.fromObject({
            totim_start: 0,
            perlen: stressPeriods.totim,
            nstp: 1,
            tsmult: 1,
            steady: true
        }))
    }

    static fromDefaults() {
        return Stressperiods.create(moment.utc('2000-01-01'), moment.utc('2019-12-31'), TimeUnit.days());
    }

    static fromObject(obj) {
        const stressPeriods = new Stressperiods();
        stressPeriods.startDateTime = moment.utc(obj.start_date_time);
        stressPeriods.endDateTime = moment.utc(obj.end_date_time);
        stressPeriods.timeUnit = obj.time_unit;

        obj.stress_periods.forEach(sp => {
            stressPeriods.addStressPeriod(Stressperiod.fromObject(sp));
        });

        return stressPeriods;
    }

    get startDateTime() {
        return this._startDateTime;
    }

    set startDateTime(value) {
        this._startDateTime = value;
    }

    get endDateTime() {
        return this._endDateTime;
    }

    set endDateTime(value) {
        this._endDateTime = value;
    }

    set stressperiods(stressperiods) {
        this._stressperiods = [];
        stressperiods = this.recalculate(stressperiods);
        stressperiods.forEach(s => {
            this.addStressPeriod(s)
        })
    }

    get stressperiods() {
        return this._stressperiods;
    }

    orderStressperiods() {
        this._stressperiods = orderBy(this._stressperiods, [sp => sp.totimStart], ['asc']);
    }

    getStressperiodByIdx(idx) {
        return this._stressperiods[idx];
    }

    last() {
        return this.stressperiods[this.count-1];
    }

    updateStressperiodByIdx(idx, stressperiod) {
        this._stressperiods[idx] = stressperiod;
        this.stressperiods = this.recalculate(this.stressperiods);

    }

    get count() {
        return this._stressperiods.length;
    }

    addStressPeriod(stressPeriod) {
        if (!stressPeriod instanceof Stressperiod) {
            throw new Error('Stressperiod ess expected to be instance of Stressperiod')
        }

        this._stressperiods.push(stressPeriod);
    }

    removeStressPeriod(id) {
        const stressperiods = [];
        this.stressperiods.forEach((sp, idx) => {
            if (id !== idx) {
                stressperiods.push(sp);
            }
        });

        this.stressperiods = stressperiods;
    }

    get dateTimes() {
        return this.stressperiods.map(sp => {
            switch (this.timeUnit) {
                case(4): {
                    return moment(this.startDateTime).utc().add(sp.totimStart, 'days').format();
                }
                default:
                    return moment(this.startDateTime).utc().add(sp.totimStart, 'days').format();
            }
        });
    }

    get timeUnit() {
        return this._timeUnit;
    }

    set timeUnit(value) {
        this._timeUnit = value;
    }

    get totim() {
        return this.endDateTime.diff(this.startDateTime, 'days') + 1;
    }

    totimFromDate(dateTime) {
        return dateTime.diff(this.startDateTime, 'days') + 1;
    }

    recalculate = (stressperiods) => {
        for (let i = 0; i < stressperiods.length - 1; i++) {
            stressperiods[i].perlen = stressperiods[i + 1].totimStart - stressperiods[i].totimStart;
        }

        stressperiods[stressperiods.length - 1].perlen = this.totim - stressperiods[stressperiods.length - 1].totimStart;
        return stressperiods;
    };

    recalculateStressperiods = () => {
        const stressperiods = this.stressperiods;
        for (let i = 0; i < stressperiods.length - 1; i++) {
            stressperiods[i].perlen = stressperiods[i + 1].totimStart - stressperiods[i].totimStart;
        }

        stressperiods[stressperiods.length - 1].perlen = this.totim - stressperiods[stressperiods.length - 1].totimStart;
        this.stressperiods = stressperiods;
    };

    toObject() {
        return {
            start_date_time: dateToString(this.startDateTime),
            end_date_time: dateToString(this.endDateTime),
            stress_periods: this.stressperiods.map(sp => sp.toObject()),
            time_unit: this.timeUnit
        };
    }
}

export default Stressperiods;
