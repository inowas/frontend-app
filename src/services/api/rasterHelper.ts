import {RasterLayer} from '../../core/model/mcda/gis';
import {retrieveDroppedData} from './index';

export interface ITask {
    raster: RasterLayer;
    oldUrl: string;
    onSuccess: (response: RasterLayer) => any;
}

// {raster, oldUrl, onSuccess}
export const retrieveRasters = (tasks: ITask[], onSuccess: () => any) => {
    if (tasks.length === 0) {
        return onSuccess();
    }

    const task = tasks.shift();

    if (task && task.raster.url !== '' && task.raster.data.length === 0) {
        retrieveDroppedData(
            task.raster.url,
            (response: any) => {
                task.raster.data = response;
                task.onSuccess(task.raster);
                retrieveRasters(tasks, onSuccess);
            },
            (response: string) => {
                throw new Error(response);
            }
        );
    } else {
        retrieveRasters(tasks, onSuccess);
    }
};
