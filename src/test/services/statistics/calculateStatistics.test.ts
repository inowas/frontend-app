import math from 'mathjs';
import calculateStatistics from '../../../services/statistics/calculateStatistics';
import {expectedStatistics, input} from './inputData';

test('Calculate Statistics 1', () => {
    const calculated = calculateStatistics(input);

    if (calculated === null) {
        expect(calculated).toBeTruthy();
        return;
    }

    expect(calculated.observed).toEqual(expectedStatistics.observed);
    expect(calculated.simulated).toEqual(expectedStatistics.simulated);
    expect(calculated.n).toEqual(expectedStatistics.n);
    expect(calculated.rMax).toEqual(expectedStatistics.rMax);
    expect(calculated.rMin).toEqual(expectedStatistics.rMin);
    expect(math.round(calculated.rMean, 12)).toEqual(math.round(expectedStatistics.rMean, 12));
    expect(math.round(calculated.absRMean, 15)).toEqual(math.round(expectedStatistics.absRMean, 15));
    expect(math.round(calculated.sse, 5)).toEqual(math.round(expectedStatistics.sse, 5));
    expect(math.round(calculated.rmse, 12)).toEqual(math.round(expectedStatistics.rmse, 12));
    expect(math.round(calculated.R, 10)).toEqual(math.round(expectedStatistics.R, 10));
    expect(math.round(calculated.R2, 5)).toEqual(math.round(expectedStatistics.R2, 5));
    expect(math.round(calculated.nrmse, 15)).toEqual(math.round(expectedStatistics.nrmse, 15));
    expect(calculated.Z).toEqual(expectedStatistics.Z);
    expect(math.round(calculated.stdObserved, 3)).toEqual(math.round(expectedStatistics.stdObserved, 3));
    expect(math.round(calculated.deltaStd, 4)).toEqual(math.round(expectedStatistics.deltaStd, 4));
    expect(calculated.weightedResiduals).toEqual(expectedStatistics.weightedResiduals);
    expect(calculated.linearRegressionOS).toEqual(expectedStatistics.linearRegressionOS);
    expect(calculated.rankedResiduals).toEqual(expectedStatistics.rankedResiduals);
    expect(calculated.npf).toEqual(expectedStatistics.npf);
    expect(calculated.linearRegressionRN).toEqual(expectedStatistics.linearRegressionRN);
});
