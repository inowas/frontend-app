import gaussian from 'gaussian';
import {sortBy, uniq} from 'lodash';
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
    eq: string;
    exec: (v: number) => number;
}

/**
 * Found here:
 *
 * https://stackoverflow.com/a/42594819/4908723
 */
const linearRegression = (x: number[], y: number[]): ILinearRegression => {
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
        see: math.round(see, 4) as number,
        eq: `f(x) = ${math.round(slope, 3)}x ${intercept < 0 ? '-' : '+'}` +
            ` ${math.abs(math.round(intercept, 3) as number)}`,
        exec: (v: number) => v * slope + intercept,
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

const calculateResidualStats = (residuals: number[], observed: number[]) => {
    const rmse = math.sqrt(residuals.map((r) => r * r).reduce((a, b) => a + b) / residuals.length);
    return {
        std: math.std(residuals, 'uncorrected'),
        sse: math.std(residuals, 'uncorrected') / math.sqrt(residuals.length),
        rmse,
        nrmse: rmse / (math.max(observed) - math.min(observed)),
        max: math.max(residuals),
        mean: math.mean(residuals),
        min: math.min(residuals),
    };
};

export const calculateStatistics = (data: IHobData, exclude: string[] = []): IStatistics | null => {

    const recalculatedData = data
        .filter((d) => {
            let excluded = false;
            exclude.forEach((e) => {
                if (d.name.indexOf(e) > -1) {
                    excluded = true;
                }
            });

            return !excluded;
        })
        .map((d) => ({
            ...d,
            residual: d.simulated - d.observed,
            absResidual: Math.abs(d.simulated - d.observed)
        }));

    const n = recalculatedData.length;

    if (n < 2) {
        return null;
    }

    recalculatedData.sort((a, b) => a.residual - b.residual);
    const recalculatedDataWithNpf = recalculatedData.map((d, idx) => (
        {...d, npf: math.round(calculateNpf(idx + 1, n), 3) as number}
    ));

    recalculatedDataWithNpf.sort((a, b) => ('' + a.name).localeCompare(b.name));

    return {
        names: uniq(data.map((d) => {
            let {name} = d;
            name = name.replace(/\d+$/, '');
            if (name.endsWith('.') || name.endsWith('_')) {
                return name.substr(0, name.length - 1);
            }

            return name;
        })),
        data: recalculatedDataWithNpf,
        stats: {
            observed: {
                std: math.std(recalculatedData.map((d) => d.observed), 'uncorrected'),
                z: 1.96,
                deltaStd: 1.96 * math.std(recalculatedData.map((d) => d.observed), 'uncorrected') / math.sqrt(n)
            },
            simulated: {
                std: math.std(recalculatedData.map((d) => d.simulated), 'uncorrected'),
            },
            residual: calculateResidualStats(
                recalculatedData.map((d) => d.residual),
                recalculatedData.map((d) => d.observed)
            ),
            absResidual: {
                min: math.min(recalculatedData.map((d) => d.absResidual)),
                max: math.max(recalculatedData.map((d) => d.absResidual)),
                mean: math.mean(recalculatedData.map((d) => d.absResidual))
            }
        },
        linRegObsSim: linearRegression(
            recalculatedData.map((d) => d.observed),
            recalculatedData.map((d) => d.simulated)
        ),
        linRegResSim: linearRegression(
            recalculatedData.map((d) => d.simulated),
            recalculatedData.map((d) => d.residual)
        ),
        linRegObsRResNpf: linearRegression(
            sortBy(recalculatedDataWithNpf.map((d) => d.residual), ['npf']),
            sortBy(recalculatedDataWithNpf.map((d) => d.npf), ['npf']) as number[],
        )
    };
};

export default calculateStatistics;
