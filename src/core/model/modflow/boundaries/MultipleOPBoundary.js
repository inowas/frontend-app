import Boundary from './Boundary';

export default class MultipleOPBoundary extends Boundary {

    _observationPoints = [];

    setDefaultStartValues(utcIsoStartDateTimes) {
        if (!Array.isArray(utcIsoStartDateTimes)) {
            utcIsoStartDateTimes = [utcIsoStartDateTimes];
        }

        const dateTimeValues = [];
        utcIsoStartDateTimes.forEach(dt => {
            console.log(dt);
            dateTimeValues.push({date_time: dt, values: this.defaultValues})
        });

        this.observationPoints = [{
            id: 'op1',
            name: 'OP1',
            geometry: {type: 'Point', coordinates: this.geometry.coordinates[0]},
            date_time_values: dateTimeValues
        }];
    }

    setDefaultValues(utcIsoStartDateTime, observationPointId = null) {
        const dateTimeValues = [{date_time: utcIsoStartDateTime, values: this.defaultValues}];
        this.setDateTimeValues(dateTimeValues, observationPointId);
    }

    get observationPoints() {
        return this._observationPoints;
    }

    set observationPoints(observationPoints) {
        this._observationPoints = observationPoints;
    }

    getDateTimeValues(observationPointId = null) {
        if (observationPointId === null) {
            return this.observationPoints[0].date_time_values;
        }

        const observationPoint = this.observationPoints.filter(op => op.id === observationPointId)[0];
        return observationPoint.date_time_values;
    }

    setDateTimeValues(dateTimeValues, observationPointId = null) {
        if (observationPointId === null) {
            this.observationPoints[0].date_time_values = dateTimeValues;
        }

        this.observationPoints.map(op => {
            if (op.id === observationPointId) {
                op.date_time_values = dateTimeValues;
            }

            return op;
        });
    }

    get toObject() {
        return {
            ...super.toObject,
            observation_points: this.observationPoints,
        };
    }
}
