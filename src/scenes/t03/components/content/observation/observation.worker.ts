import calculateStatistics from '../../../../../services/statistics/calculateStatistics';
import {IObservationWorkerInput, IObservationWorkerResult} from './observation.worker.type';

export const CALCULATE_STATISTICS_INPUT = 'CALCULATE_STATISTICS_INPUT';
export const CALCULATE_STATISTICS_RESULT = 'CALCULATE_STATISTICS_RESULT';

const ctx: Worker = self as any;

// Respond to message from parent thread
ctx.addEventListener('message', (e) => {
    if (!e) {
        return;
    }

    const message: IObservationWorkerInput = e.data;
    const {type, data} = message;

    if (type === CALCULATE_STATISTICS_INPUT) {
        const m: IObservationWorkerResult = {
            type: CALCULATE_STATISTICS_RESULT,
            data: calculateStatistics(data.data, data.exclude)
        };

        // @ts-ignore
        postMessage(m);
    }
});
