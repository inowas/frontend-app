class OptimizationProgress {
    _progressLog = [];
    _iteration = 0;
    _iterationTotal = 0;
    _simulation = 0;
    _simulationTotal = 0;
    _final = false;

    static fromObject(obj) {
        const progress = new OptimizationProgress();
        progress.progressLog = obj.progress_log;
        progress.iteration = obj.iteration;
        progress.iterationTotal = obj.iteration_total;
        progress.final = obj.final;
        progress.simulation = obj.simulation;
        progress.simulationTotal = obj.simulation_total;
        return progress;
    }

    get progressLog() {
        return this._progressLog;
    }

    set progressLog(value) {
        this._progressLog = value ? value : [];
    }

    get iteration() {
        return this._iteration;
    }

    set iteration(value) {
        this._iteration = value ? value : 0;
    }

    get iterationTotal() {
        return this._iterationTotal;
    }

    set iterationTotal(value) {
        this._iterationTotal = value ? value : 0;
    }

    get final() {
        return this._final;
    }

    set final(value) {
        this._final = value ? value : false;
    }

    get simulation() {
        return this._simulation;
    }

    set simulation(value) {
        this._simulation = value ? value : 0;
    }

    get simulationTotal() {
        return this._simulationTotal;
    }

    set simulationTotal(value) {
        this._simulationTotal = value ? value : 0;
    }

    get toObject() {
        return {
            'progress_log': this.progressLog,
            'simulation': this.simulation,
            'simulation_total': this.simulationTotal,
            'iteration': this.iteration,
            'iteration_total': this.iterationTotal,
            'final': this.final
        };
    }

    calculate() {
        if (this.iterationTotal === 0) {
            return 0;
        }

        if (this.simulationTotal === 0) {
            return parseFloat((this.iteration / this.iterationTotal * 100).toFixed(1));
        }

        const i = parseFloat(this.iteration);
        const iMax = parseFloat(this.iterationTotal);
        const s = parseFloat(this.simulation);
        const sMax = parseFloat(this.simulationTotal);

        const progress = (((i - 1) * sMax + s) / (iMax * sMax) * 100).toFixed(1);
        return parseFloat(progress);
    }

    get toChartData() {
        return this.progressLog.map((p, key) => {
            return {
                name: key,
                log: parseFloat(p.toFixed(2))
            };
        });
    }
}

export default OptimizationProgress;