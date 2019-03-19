import moment from 'moment/moment';
import Stressperiod from './Stressperiod';
import {cloneDeep} from 'lodash';
import {TimeUnit} from './index';

class Stressperiods {

    _startDateTime = null;
    _endDateTime = null;
    _stressperiods = [];
    _timeUnit;

    static create(startDate, endDate, timeUnit) {
        const stressPeriods = new Stressperiods();
        stressPeriods.startDateTime = new moment.utc(startDate);
        stressPeriods.endDateTime = new moment.utc(endDate);
        stressPeriods.timeUnit = (timeUnit instanceof TimeUnit) ? timeUnit.toInt() : timeUnit;

        stressPeriods.addStressPeriod(Stressperiod.fromObject({
            start_date_time: startDate,
            nstp: 1,
            tsmult: 1,
            steady: true
        }));

        return stressPeriods;
    }

    static fromDefaults() {
        return Stressperiods.create(moment.utc('2000-01-01'), moment.utc('2019-12-31'), TimeUnit.days());
    }

    static fromObject(obj) {
        const stressPeriods = new Stressperiods();
        const startDateTime = moment.utc(obj.start_date_time);
        const endDateTime = moment.utc(obj.end_date_time);
        const timeUnit = obj.time_unit;

        stressPeriods.startDateTime = startDateTime;
        stressPeriods.endDateTime = endDateTime;
        stressPeriods.timeUnit = timeUnit;

        obj.stressperiods.forEach(sp => {
            stressPeriods.addStressPeriod(Stressperiod.fromObject({
                start_date_time: Stressperiods.dateTimeFromTotim(startDateTime, sp.totim_start, timeUnit),
                nstp: sp.nstp,
                tsmult: sp.tsmult,
                steady: sp.steady
            }));
        });

        return stressPeriods;
    }

    static dateTimeFromTotim(startDateTime, totim, timeUnit) {
        switch (timeUnit) {
            case(4): {
                return new moment.utc(startDateTime).add(totim, 'days').format();
            }
            default:
                return new moment.utc(startDateTime).add(totim, 'days').format();
        }
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

    getStressperiodByIdx(idx) {
        return this._stressperiods[idx];
    }

    last() {
        return this.stressperiods[this.count - 1];
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
            throw new Error('Stressperiod expected to be instance of Stressperiod')
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
        return this.stressperiods.map(sp => sp.startDateTime);
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

    get perlens() {
        const totims = [];
        this.stressperiods.forEach(sp => {
            totims.push(this.totimFromDate(sp.startDateTime))
        });

        totims.push(this.totimFromDate(this.endDateTime));

        const perlens = [];
        for (let i = 1; i < totims.length; i++) {
            perlens.push(totims[i] - totims[i - 1]);
        }

        return perlens;
    }

    totimFromDate(dateTime) {
        if (!(dateTime instanceof moment)) {
            dateTime = moment.utc(dateTime);
        }
        switch (this.timeUnit) {
            case(4): {
                return dateTime.diff(this.startDateTime, 'days');
            }
            default:
                return dateTime.diff(this.startDateTime, 'days');
        }
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

    toObject = () => {
        const stressperiods = [];
        let lastTotimStart = 0;

        for (let i = 0; i < this.stressperiods.length; i++) {
            const sp = this.stressperiods[i];
            let currentTotimStart = this.totimFromDate(sp.startDateTime);

            stressperiods.push({
                totim_start: currentTotimStart,
                perlen: currentTotimStart - lastTotimStart,
                nstp: sp.nstp,
                tsmult: sp.tsmult,
                steady: sp.steady
            });

            lastTotimStart = cloneDeep(currentTotimStart);
        }

        return {
            start_date_time: this.startDateTime.toISOString(),
            end_date_time: this.endDateTime.toISOString(),
            stressperiods: stressperiods,
            time_unit: this.timeUnit
        };
    }
}

export default Stressperiods;
