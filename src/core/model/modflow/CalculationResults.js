export default class CalculationResults {
    _calculationId;
    _layerValues;
    _times;

    static fromQuery(query) {
        return CalculationResults.fromObject(query);
    }

    static fromObject(obj) {
        const results = new CalculationResults();
        results._calculationId = obj.calculation_id;
        results._layerValues = obj.layer_values;
        results._times = obj.times;
        return results;
    }

    get calculationId() {
        return this._calculationId;
    }

    get layerValues() {
        return this._layerValues;
    }

    get totalTimes() {
        return this.times.total_times;
    }

    get times() {
        return this._times;
    }

    toObject() {
        return {
            calculation_id: this._calculationId,
            layer_values: this._layerValues,
            times: this._times
        }
    }
}
