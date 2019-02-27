import {retrieveDroppedData} from './index';

// {raster, oldUrl, onSuccess}
export const retrieveRasters = (tasks, onSuccess) => {
    if (tasks.length === 0) {
        return onSuccess();
    }

    const task = tasks.shift();

    if (task.raster.url && task.raster.data.length === 0) {
        retrieveDroppedData(
            task.raster.url,
            response => {
                task.raster.data = response;
                task.onSuccess(task.raster);
                retrieveRasters(tasks, onSuccess);
            },
            response => {
                throw new Error(response);
            }
        );
    } else {
        retrieveRasters(tasks, onSuccess);
    }
};