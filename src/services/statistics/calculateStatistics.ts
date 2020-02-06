import gaussian from 'gaussian';
import {cloneDeep} from 'lodash';
import math from 'mathjs';
import {IHobData, IStatistics} from '../../scenes/t03/components/content/observation/statistics';

export interface ILinearRegression {
    slope: number;
    intercept: number;
    r: number;
    r2: number;
    sse: number;
    ssr: number;
    sst: number;
    sy: number;
    sx: number;
    see: number;
}

/**
 * Found here:
 *
 * https://stackoverflow.com/a/42594819/4908723
 */
const linearRegression = (x: number[], y: number[]) => {
    const n = y.length;
    let sx = 0;
    let sy = 0;
    let sxy = 0;
    let sxx = 0;
    let syy = 0;
    for (let i = 0; i < n; i++) {
        sx += x[i];
        sy += y[i];
        sxy += x[i] * y[i];
        sxx += x[i] * x[i];
        syy += y[i] * y[i];
    }
    const mx = sx / n;
    const my = sy / n;
    const yy = n * syy - sy * sy;
    const xx = n * sxx - sx * sx;
    const xy = n * sxy - sx * sy;
    const slope = xy / xx;
    const intercept = my - slope * mx;
    const r = xy / Math.sqrt(xx * yy);
    const r2 = Math.pow(r, 2);
    let sst = 0;
    for (let i = 0; i < n; i++) {
        sst += Math.pow((y[i] - my), 2);
    }
    const sse = sst - r2 * sst;
    const see = Math.sqrt(sse / (n - 2));
    const ssr = sst - sse;
    return {
        slope: math.round(slope, 4) as number,
        intercept: math.round(intercept, 4) as number,
        r: math.round(r, 4) as number,
        r2: math.round(r2, 4) as number,
        sse: math.round(sse, 4) as number,
        ssr: math.round(ssr, 4) as number,
        sst: math.round(sst, 4) as number,
        sy: math.round(sy, 4) as number,
        sx: math.round(sx, 4) as number,
        see: math.round(see, 4) as number
    } as ILinearRegression;
};

const calculateNpf = (x: number, n: number) => {
    let a = 0.5;
    if (n <= 10) {
        a = 3 / 8;
    }

    const distribution = gaussian(0, 1);
    return distribution.ppf((x - a) / (n + 1 - 2 * a));
};

const calculateStatistics = (data: IHobData): IStatistics | null => {

    const n = data.length;

    if (n < 2) {
        return null;
    }

    const simulated = data.map((d) => d.simulated);
    const observed = data.map((d) => d.observed);
    const oMean = observed.reduce((a, b) => a + b) / n;

    const residuals = data.map((d) => d.simulated - d.observed);
    const rMean = residuals.reduce((a, b) => a + b) / n;

    const rAbs = residuals.map((d) => Math.abs(d));
    const rAbsMean = (rAbs.reduce((a, b) => a + b)) / rAbs.length;
    const rAbsMin = Math.min(...rAbs);
    const rAbsMax = Math.max(...rAbs);

    // standard deviation
    const std = math.std(residuals, 'uncorrected');

    // standard error
    const sse = std / math.sqrt(n);

    // root mean square error
    const rmse = math.sqrt(residuals.map((d) => d * d).reduce((a, b) => a + b) / n);

    const R = linearRegression(observed, simulated).r;
    const R2 = linearRegression(observed, simulated).r2;

    const nrmse = rmse / (math.max(observed) - math.min(observed));

    const Z = 1.96;

    const stdObserved = Math.sqrt(observed.map((o) => Math.pow(o - oMean, 2)).reduce((a, b) => a + b) / n);
    const stdSimulated = math.std(simulated, 'uncorrected');

    const deltaStd = Z * stdObserved / math.sqrt(n);

    const rankedResiduals = cloneDeep(residuals).sort((a, b) => a - b).map((r) => math.round(r, 2)) as number[];

    const npf = new Array(n).fill(1)
        .map((v, idx) => idx + 1)
        .map((x) => calculateNpf(x, n))
        .map((v) => math.round(v, 3)) as number[];

    return {
        observed,
        simulated,
        n,
        rMax: rAbsMax,
        rMean,
        rMin: rAbsMin,
        absRMean: rAbsMean,
        sse,
        rmse,
        R,
        R2,
        nrmse,
        Z,
        stdObserved,
        stdSimulated,
        deltaStd,
        weightedResiduals: residuals.map((r) => math.round(r, 2) as number),
        linearRegressionOS: linearRegression(observed, simulated),
        rankedResiduals,
        npf,
        linearRegressionRN: linearRegression(rankedResiduals, npf),
    };
};

export default calculateStatistics;
