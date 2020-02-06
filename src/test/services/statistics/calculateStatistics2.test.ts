import math from 'mathjs';
import calculateStatistics from '../../../services/statistics/calculateStatistics';
import {expectedStatistics, input} from './inputData2';

test('Calculate Statistics 2', () => {
    const calculated = calculateStatistics(input);

    if (calculated === null) {
        expect(calculated).toBeTruthy();
        return;
    }

    expect(calculated.observed).toEqual(expectedStatistics.observed);
    expect(calculated.simulated).toEqual(expectedStatistics.simulated);
    expect(calculated.n).toEqual(expectedStatistics.n);
    expect(math.round(calculated.rMax, 2)).toEqual(math.round(expectedStatistics.rMax, 2));
    expect(math.round(calculated.rMin, 2)).toEqual(math.round(expectedStatistics.rMin, 2));
    expect(math.round(calculated.rMean, 2)).toEqual(math.round(expectedStatistics.rMean, 2));
    expect(math.round(calculated.absRMean, 2)).toEqual(math.round(expectedStatistics.absRMean, 2));
    expect(math.round(calculated.sse, 2)).toEqual(math.round(expectedStatistics.sse, 2));
    expect(math.round(calculated.rmse, 2)).toEqual(math.round(expectedStatistics.rmse, 2));
    expect(math.round(calculated.nrmse, 2)).toEqual(math.round(expectedStatistics.nrmse, 2));
    expect(math.round(calculated.R, 2)).toEqual(math.round(expectedStatistics.R, 2));
    expect(math.round(calculated.R2, 2)).toEqual(math.round(expectedStatistics.R2, 2));
    expect(math.round(calculated.Z, 2)).toEqual(math.round(expectedStatistics.Z, 2));
    expect(math.round(calculated.stdObserved, 2)).toEqual(math.round(expectedStatistics.stdObserved, 2));
    expect(math.round(calculated.stdSimulated, 2)).toEqual(math.round(expectedStatistics.stdSimulated, 2));
    expect(math.round(calculated.deltaStd, 2)).toEqual(math.round(expectedStatistics.deltaStd, 2));
    expect(calculated.weightedResiduals).toEqual(expectedStatistics.weightedResiduals);
    expect(calculated.linearRegressionOS).toEqual(expectedStatistics.linearRegressionOS);
    expect(calculated.rankedResiduals).toEqual(expectedStatistics.rankedResiduals);
    expect(calculated.npf).toEqual(expectedStatistics.npf);
    expect(calculated.linearRegressionRN).toEqual(expectedStatistics.linearRegressionRN);
});
