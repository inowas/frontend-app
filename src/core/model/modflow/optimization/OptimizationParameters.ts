import {EOptimizationMethod, IOptimizationParameters} from './OptimizationParameters.type';

class OptimizationParameters {

    get method() {
        return this._props.method;
    }

    set method(value: EOptimizationMethod) {
        switch (value) {
            case 'GA':
                this._props.method = EOptimizationMethod.GA;
                break;
            default:
                this._props.method = EOptimizationMethod.SIMPLEX;
                break;
        }
    }

    get ngen() {
        return this._props.ngen;
    }

    set ngen(value) {
        this._props.ngen = this.applyMinMax(value, 0, 500);
    }

    get popSize() {
        return this._props.popSize;
    }

    set popSize(value) {
        this._props.popSize = this.applyMinMax(value, (this.ncls < 2 ? 2 : this.ncls), 500);
    }

    get mutpb() {
        return this._props.mutpb;
    }

    set mutpb(value) {
        this._props.mutpb = this.applyMinMax(value, 0, 1);
    }

    get cxpb() {
        return this._props.cxpb;
    }

    set cxpb(value) {
        this._props.cxpb = this.applyMinMax(value, 0, 1);
    }

    get eta() {
        return this._props.eta;
    }

    set eta(value) {
        this._props.eta = this.applyMinMax(value, 0, null);
    }

    get indpb() {
        return this._props.indpb;
    }

    set indpb(value) {
        this._props.indpb = this.applyMinMax(value, 0, 1);
    }

    get ncls() {
        return this._props.ncls;
    }

    set ncls(value) {
        this._props.ncls = this.applyMinMax(value, 1, 100);
        this._props.popSize = this.applyMinMax(this.popSize, (this.ncls < 2 ? 2 : this.ncls), 100);
    }

    get maxf() {
        return this._props.maxf;
    }

    set maxf(value) {
        this._props.maxf = this.applyMinMax(value, 1, 200);
    }

    get qbound() {
        return this._props.qbound;
    }

    set qbound(value) {
        this._props.qbound = this.applyMinMax(value, 0, 1);
    }

    get xtol() {
        return this._props.xtol;
    }

    set xtol(value) {
        this._props.xtol = this.applyMinMax(value, 0, 1);
    }

    get ftol() {
        return this._props.ftol;
    }

    set ftol(value) {
        this._props.ftol = this.applyMinMax(value, 0, 1);
    }

    get diversityFlg() {
        return this._props.diversityFlg;
    }

    set diversityFlg(value) {
        this._props.diversityFlg = value;
    }

    get reportFrequency() {
        return this._props.reportFrequency;
    }

    set reportFrequency(value) {
        this._props.reportFrequency = this.applyMinMax(value, 0, this.popSize);
    }

    get initialSolutionId() {
        return this._props.initialSolutionId;
    }

    set initialSolutionId(value) {
        this._props.initialSolutionId = value || null;
    }

    public static fromDefaults() {
        return new this({
            method: EOptimizationMethod.GA,
            ngen: 100,
            ncls: 1,
            popSize: 100,
            mutpb: 0.1,
            cxpb: 0.9,
            eta: 20,
            indpb: 0.1,
            maxf: 50,
            qbound: 0.25,
            xtol: 0.0001,
            ftol: 0.0001,
            diversityFlg: false,
            reportFrequency: 50,
            initialSolutionId: null
        });
    }

    public static fromObject(obj: IOptimizationParameters) {
        return new this(obj);
    }

    private readonly _props: IOptimizationParameters;

    constructor(props: IOptimizationParameters) {
        this._props = props;
    }

    public toObject() {
        return this._props;
    }

    protected applyMinMax = (value: number, min: number | null = null, max: number | null = null) => {
        if (min !== null && value < min) {
            return min;
        }
        if (max !== null && value > max) {
            return max;
        }
        if (min !== null && isNaN(value)) {
            return min;
        }
        return value;
    };
}

export default OptimizationParameters;
