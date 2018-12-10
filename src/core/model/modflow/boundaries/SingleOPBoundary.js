import Boundary from './Boundary';

export default class SingleOPBoundary extends Boundary {

    _dateTimeValues = [];

    setDefaultStartValues(utcIsoStartDateTime) {
        this._dateTimeValues = [
            {date_time: utcIsoStartDateTime, values: this.defaultValues}
        ];
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

    getIndexedDateTimeValues() {
        return this._dateTimeValues.map((value, index) => {
            return {...value, id: index};
        });
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
