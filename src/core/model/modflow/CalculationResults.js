export default class CalculationResults {
    _calculationId;
    _layerValues;
    _times;

    static fromQuery(query) {
        const results = new CalculationResults();
        results._calculationId = query.calculation_id;
        results._layerValues = query.layer_values;
        results._times = query.times;
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
}