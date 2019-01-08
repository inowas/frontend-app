import Boundary from './Boundary';

export default class SingleOPBoundary extends Boundary {

    _dateTimeValues = [];

    setDefaultStartValues(utcIsoStartDateTimes) {
        if (!Array.isArray(utcIsoStartDateTimes)) {
            utcIsoStartDateTimes = [utcIsoStartDateTimes];
        }

        utcIsoStartDateTimes.forEach(dt => {
            this._dateTimeValues.push({
                date_time: dt, values: this.defaultValues
            })
        });
    }

    setDefaultValues(utcIsoStartDateTime) {
        this.setDefaultStartValues(utcIsoStartDateTime);
    }

    get dateTimeValues() {
        return this.getDateTimeValues();
    }

    getDateTimeValues() {
        return this._dateTimeValues;
    }

    setDateTimeValues(dateTimeValues) {
        this._dateTimeValues = dateTimeValues;
    }

    isValid() {
        super.isValid();

        // noinspection RedundantIfStatementJS
        if (!(Array.isArray(this._dateTimeValues) && (this._dateTimeValues.length > 0))) {
            throw new Error('The parameter _dateTimeValues is not not valid.');
        }

        return true;
    }

    get toObject() {
        return {
            ...super.toObject,
            date_time_values: this.dateTimeValues
        };
    }
}
