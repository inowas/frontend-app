// @ts-ignore
import calculateStatistics from '../../../../../services/statistics/calculateStatistics';

const ctx: Worker = self as any;

// Respond to message from parent thread
ctx.addEventListener('message', (e) => {
    if (!e) {
        return;
    }

    const message: any = e.data;
    const {type, data} = message;

    if (type === 'CALCULATE_STATISTICS_INPUT') {
        const statistics = calculateStatistics(data.data, data.exclude);
        // @ts-ignore
        postMessage({
            type: 'CALCULATE_STATISTICS_RESULT',
            data: statistics
        });
    }
});
