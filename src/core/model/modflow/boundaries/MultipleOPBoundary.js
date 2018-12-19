import Boundary from './Boundary';
import {cloneDeep} from 'lodash';
import uuid from 'uuid';

export default class MultipleOPBoundary extends Boundary {

    _observationPoints = [];

    setDefaultStartValues(utcIsoStartDateTimes) {
        if (!Array.isArray(utcIsoStartDateTimes)) {
            utcIsoStartDateTimes = [utcIsoStartDateTimes];
        }

        const dateTimeValues = [];
        utcIsoStartDateTimes.forEach(dt => {
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

    cloneObservationPoint(opId, newOpId) {
        if (!this.hasObservationPoint(opId)) {
            throw new Error('ObservationPoint with id:' + opId + ' not found')
        }

        if (!newOpId) {
            newOpId = uuid.v4();
        }

        if (this.hasObservationPoint(newOpId)) {
            throw new Error('ObservationPoint with id:' + opId + ' already exists')
        }

        const observationPoint = this.getObservationPointById(opId);
        const newObservationPoint = cloneDeep(observationPoint);
        newObservationPoint.id = newOpId;
        newObservationPoint.name = observationPoint.name + ' (Clone)';
        this._observationPoints.push(newObservationPoint);
    }

    getDateTimeValues(observationPointId = null) {
        if (observationPointId === null) {
            return this.observationPoints[0].date_time_values;
        }

        const filteredOps = this.observationPoints.filter(op => op.id === observationPointId);
        if (filteredOps.length > 0) {
            return filteredOps[0].date_time_values;
        }

        return null;
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

    hasObservationPoint(oId) {
        return this.observationPoints.filter(op => op.id === oId).length > 0
    }

    getObservationPointById(oId) {
        if (this.hasObservationPoint(oId)) {
            return this.observationPoints.filter(op => op.id === oId)[0];
        }

        return null;
    }

    updateObservationPoint(observationPoint) {
        this.observationPoints = this.observationPoints.map(op => {
            if (op.id === observationPoint.id) {
                return observationPoint;
            }
            return op;
        });

        return this;
    }

    removeObservationPoint(observationPointId) {
        if (this.observationPoints.length > 1) {
            this.observationPoints = this.observationPoints.filter(op => op.id !== observationPointId);
        }
    }
}
