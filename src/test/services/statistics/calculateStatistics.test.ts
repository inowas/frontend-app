import math from 'mathjs';
import calculateStatistics from '../../../services/statistics/calculateStatistics';
import {expectedStatistics, input} from './inputData';

test('Calculate Statistics', () => {
    const stats = calculateStatistics(input);

    if (stats === null) {
        expect(stats).toBeTruthy();
        return;
    }

    const observed = stats.data.map((d) => d.observed);
    expect(observed.sort()).toEqual(expectedStatistics.observed.sort());

    const simulated = stats.data.map((d) => d.simulated);
    expect(simulated.sort()).toEqual(expectedStatistics.simulated.sort());

    expect(stats.data.length).toEqual(expectedStatistics.n);

    const absResiduals = stats.data.map((d) => d.absResidual);
    expect(math.max(absResiduals)).toEqual(expectedStatistics.rMax);
    expect(math.min(absResiduals)).toEqual(expectedStatistics.rMin);
    expect(math.round(math.mean(absResiduals), 12)).toEqual(math.round(expectedStatistics.absRMean, 12));

    const residuals = stats.data.map((d) => d.residual);
    expect(math.round(math.mean(residuals), 12)).toEqual(math.round(expectedStatistics.rMean, 12));

    expect(math.round(stats.stats.residual.sse, 5)).toEqual(math.round(expectedStatistics.sse, 5));
    expect(math.round(stats.stats.residual.rmse, 12)).toEqual(math.round(expectedStatistics.rmse, 12));
    expect(math.round(stats.stats.residual.nrmse, 12)).toEqual(math.round(expectedStatistics.nrmse, 12));

    expect(math.round(stats.linRegObsSim.r, 10)).toEqual(math.round(expectedStatistics.R, 10));
    expect(math.round(stats.linRegObsSim.r2, 10)).toEqual(math.round(expectedStatistics.R2, 10));

    expect(math.round(stats.stats.observed.std, 3)).toEqual(math.round(expectedStatistics.stdObserved, 3));
    expect(math.round(stats.stats.observed.deltaStd, 4)).toEqual(math.round(expectedStatistics.deltaStd, 4));

    expect(stats.linRegObsSim.eq).toEqual(expectedStatistics.linearRegressionOS.eq);
    expect(stats.linRegObsSim.intercept).toEqual(expectedStatistics.linearRegressionOS.intercept);
    expect(stats.linRegObsSim.r).toEqual(expectedStatistics.linearRegressionOS.r);
    expect(stats.linRegObsSim.r2).toEqual(expectedStatistics.linearRegressionOS.r2);
    expect(stats.linRegObsSim.slope).toEqual(expectedStatistics.linearRegressionOS.slope);

    expect(stats.linRegObsRResNpf.eq).toEqual(expectedStatistics.linearRegressionRN.eq);
    expect(stats.linRegObsRResNpf.intercept).toEqual(expectedStatistics.linearRegressionRN.intercept);
    expect(stats.linRegObsRResNpf.r).toEqual(expectedStatistics.linearRegressionRN.r);
    expect(stats.linRegObsRResNpf.r2).toEqual(expectedStatistics.linearRegressionRN.r2);
    expect(stats.linRegObsRResNpf.slope).toEqual(expectedStatistics.linearRegressionRN.slope);
});
