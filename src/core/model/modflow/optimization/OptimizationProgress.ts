import {IOptimizationProgress} from './OptimizationProgress.type';

class OptimizationProgress {

    get progressLog() {
        return this._props.progressLog;
    }

    set progressLog(value) {
        this._props.progressLog = value ? value : [];
    }

    get iteration() {
        return this._props.iteration;
    }

    set iteration(value) {
        this._props.iteration = value;
    }

    get iterationTotal() {
        return this._props.iterationTotal;
    }

    set iterationTotal(value) {
        this._props.iterationTotal = value ;
    }

    get final() {
        return this._props.final;
    }

    set final(value) {
        this._props.final = value;
    }

    get simulation() {
        return this._props.simulation;
    }

    set simulation(value) {
        this._props.simulation = value;
    }

    get simulationTotal() {
        return this._props.simulationTotal;
    }

    set simulationTotal(value) {
        this._props.simulationTotal = value;
    }

    get toChartData() {
        return this.progressLog.map((p, key) => {
            return {
                name: key,
                log: parseFloat(p).toFixed(2)
            };
        });
    }

    public static fromObject(obj: IOptimizationProgress) {
        return new this(obj);
    }
    private readonly _props: IOptimizationProgress;

    constructor(props: IOptimizationProgress) {
        this._props = props;
    }

    public toObject() {
        return this._props;
    }

    public calculate() {
        if (this.iterationTotal === 0) {
            return 0;
        }

        if (this.simulationTotal === 0) {
            return parseFloat((this.iteration / this.iterationTotal * 100).toFixed(1));
        }

        const i = this.iteration;
        const iMax = this.iterationTotal;
        const s = this.simulation;
        const sMax = this.simulationTotal;

        const progress = (((i - 1) * sMax + s) / (iMax * sMax) * 100).toFixed(1);
        return parseFloat(progress);
    }
}

export default OptimizationProgress;
