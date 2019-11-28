import {ModflowModel} from '../../index';
import {ISoilmodel, ISoilmodel1v0, ISoilmodel2v0, ISoilmodelExport} from '../Soilmodel.type';
import {SoilmodelTypes} from './defaults';
import {saveSoilmodel} from './services';
import updateSoilmodel from './updateSoilmodel';

/**
 * The updater is an asynchronous function, which updates and saves the soilmodel if necessary.
 *
 * @param {ISoilmodelExport | ISoilmodel | ISoilmodel1v0 | ISoilmodel2v0} soilmodel
 * @param {ModflowModel} model
 * @param onEachTask callback function, which is called once in every iteration
 * @param onUpdateSuccess callback function, which is called once when all tasks are resolved
 */

const updater = (
    soilmodel: SoilmodelTypes,
    model: ModflowModel,
    onEachTask: (result: { message: string, task: number }) => any,
    onUpdateSuccess: (soilmodel: ISoilmodel, needToBeFetched: boolean) => any
): ISoilmodel | void => {
    const result = updateSoilmodel(soilmodel, model);

    if (result.isDirty && !model.readOnly) {
        return saveSoilmodel(
            model.toObject(),
            result.soilmodel,
            onEachTask,
            onUpdateSuccess,
            true,
            true
        );
    }

    return onUpdateSuccess(result.soilmodel, true);
};

export default updater;
