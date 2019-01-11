export const OPTIMIZATION_EDIT_NOCHANGES = 0;
export const OPTIMIZATION_EDIT_UNSAVED = 1;
export const OPTIMIZATION_EDIT_SAVED = 2;

export const OPTIMIZATION_STATE_NEW = 0;
export const OPTIMIZATION_STATE_STARTED = 1;
export const OPTIMIZATION_STATE_PREPROCESSING = 2;
export const OPTIMIZATION_STATE_PREPROCESSING_FINISHED = 3;
export const OPTIMIZATION_STATE_QUEUED = 4;
export const OPTIMIZATION_STATE_CALCULATING = 5;
export const OPTIMIZATION_STATE_FINISHED = 6;

export const OPTIMIZATION_STATE_CANCELLING = 11;
export const OPTIMIZATION_STATE_CANCELLED = 12;

export const OPTIMIZATION_STATE_ERROR = 40;
export const OPTIMIZATION_STATE_ERROR_RECALCULATING_MODEL = 41;
export const OPTIMIZATION_STATE_ERROR_PUBLISHING = 42;
export const OPTIMIZATION_STATE_ERROR_CANCELLING = 43;
export const OPTIMIZATION_STATE_ERROR_OPTIMIZATION_CORE = 50;

export const optimizationHasError = (code) => {
    const hasError = [
        OPTIMIZATION_STATE_ERROR,
        OPTIMIZATION_STATE_ERROR_RECALCULATING_MODEL,
        OPTIMIZATION_STATE_ERROR_PUBLISHING,
        OPTIMIZATION_STATE_ERROR_CANCELLING,
        OPTIMIZATION_STATE_ERROR_OPTIMIZATION_CORE
    ];
    return hasError.includes(code);
};

export const optimizationInProgress = (code) => {
    const inProgress = [
        OPTIMIZATION_STATE_STARTED,
        OPTIMIZATION_STATE_PREPROCESSING,
        OPTIMIZATION_STATE_PREPROCESSING_FINISHED,
        OPTIMIZATION_STATE_QUEUED,
        OPTIMIZATION_STATE_CALCULATING,
        OPTIMIZATION_STATE_CANCELLING
    ];
    return inProgress.includes(code);
};

export const getMessage = (code) => {
    switch (code) {
        case OPTIMIZATION_STATE_NEW:
            return 'New';
        case OPTIMIZATION_STATE_STARTED:
            return 'Started';
        case OPTIMIZATION_STATE_PREPROCESSING:
            return 'Pre-Processing';
        case OPTIMIZATION_STATE_PREPROCESSING_FINISHED:
            return 'Pre-Processing Finished';
        case OPTIMIZATION_STATE_QUEUED:
            return 'Queued';
        case OPTIMIZATION_STATE_CALCULATING:
            return 'Calculating';
        case OPTIMIZATION_STATE_FINISHED:
            return 'Finished';
        case OPTIMIZATION_STATE_CANCELLING:
            return 'Cancelling';
        case OPTIMIZATION_STATE_CANCELLED:
            return 'Cancelled';
        case OPTIMIZATION_STATE_ERROR:
            return 'Error';
        case OPTIMIZATION_STATE_ERROR_RECALCULATING_MODEL:
            return 'Error Recalculating Model';
        case OPTIMIZATION_STATE_ERROR_PUBLISHING:
            return 'Error Publishing';
        case OPTIMIZATION_STATE_ERROR_CANCELLING:
            return 'Error Cancelling';
        case OPTIMIZATION_STATE_ERROR_OPTIMIZATION_CORE:
            return 'Error Optimization Core';
        default:
            return `Undefined State with code: ${code}`;
    }
};