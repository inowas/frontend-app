import moment from 'moment/moment';
import Stressperiod from './Stressperiod';

const dateToString = (date) => moment.utc(date).format();

class Stressperiods {

    _startDateTime = null;
    _endDateTime = null;
    _stressperiods = [];
    _timeUnit;

    static fromObject(obj) {
        const stressPeriods = new Stressperiods();
        stressPeriods.startDateTime = new Date(obj.start_date_time);
        stressPeriods.endDateTime = new Date(obj.end_date_time);
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

    get stressperiods() {
        return this._stressperiods;
    }

    get count() {
        return this._stressperiods.length;
    }

    addStressPeriod(stressPeriod) {
        this._stressperiods.push(stressPeriod);
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

    get toObject() {
        return {
            start_date_time: dateToString(this.startDateTime),
            end_date_time: dateToString(this.endDateTime),
            stress_periods: this.stressperiods.map(sp => sp.toObject),
            time_unit: this.timeUnit
        };
    }
}

export default Stressperiods;
