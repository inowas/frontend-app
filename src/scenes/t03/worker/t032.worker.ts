import FlopyPackages from '../../../core/model/flopy/packages/FlopyPackages';
import {IFlopyPackages} from '../../../core/model/flopy/packages/FlopyPackages.type';
import {ICells} from '../../../core/model/geometry/Cells.type';
import {
    BoundaryCollection,
    BoundingBox,
    Geometry,
    GridSize,
    ModflowModel,
    Soilmodel, Transport, VariableDensity
} from '../../../core/model/modflow';
import {calculateActiveCells} from '../../../services/geoTools';
import calculateStatistics from '../../../services/statistics/calculateStatistics';
import {IStatistics} from '../components/content/observation/statistics';
import {
    ICalculateCellsInputData,
    ICalculatePackagesInputData,
    IObservationInputData,
    IWorkerInput,
    IWorkerResult
} from './t03.worker.type';

export const CALCULATE_STATISTICS_INPUT = 'CALCULATE_STATISTICS_INPUT';
export const CALCULATE_STATISTICS_RESULT = 'CALCULATE_STATISTICS_RESULT';

export const CALCULATE_CELLS_INPUT = 'CALCULATE_CELLS_INPUT';
export const CALCULATE_CELLS_RESULT = 'CALCULATE_CELLS_RESULT';

export const CALCULATE_PACKAGES_INPUT = 'CALCULATE_PACKAGES_INPUT';
export const CALCULATE_PACKAGES_RESULT = 'CALCULATE_PACKAGES_RESULT';

const ctx: Worker = self as any;

// Respond to message from parent thread
ctx.addEventListener('message', (e) => {
    if (!e) {
        return;
    }

    // @ts-ignore
    postMessage('TEST!!');

    const messageType = e.data.type;

    let input;
    let result;

    switch (messageType) {
        case CALCULATE_STATISTICS_INPUT:
            input = e.data as IWorkerInput<IObservationInputData>;
            result = {
                type: CALCULATE_STATISTICS_RESULT,
                data: calculateStatistics(input.data.data, input.data.exclude)
            } as IWorkerResult<IStatistics>;

            // @ts-ignore
            postMessage(result);
            break;

        case CALCULATE_CELLS_INPUT:
            input = e.data as IWorkerInput<ICalculateCellsInputData>;

            const geometry = input.data.geometry ? Geometry.fromObject(input.data.geometry) : null;
            const boundingBox = input.data.boundingBox ? BoundingBox.fromObject(input.data.boundingBox) : null;
            const gridSize = input.data.gridSize ? GridSize.fromObject(input.data.gridSize) : null;
            const intersection = input.data.intersection || 0;

            if (geometry && boundingBox && gridSize) {
                result = {
                    type: CALCULATE_CELLS_RESULT,
                    data: calculateActiveCells(geometry, boundingBox, gridSize, intersection).toObject()
                } as IWorkerResult<ICells>;

                // @ts-ignore
                postMessage(result);
            }

            break;

        case CALCULATE_PACKAGES_INPUT:
            input = e.data as IWorkerInput<ICalculatePackagesInputData>;

            let packages = input.data.packages ? FlopyPackages.fromObject(input.data.packages) : null;
            const model = input.data.model ? ModflowModel.fromObject(input.data.model) : null;
            const soilmodel = input.data.soilmodel ? Soilmodel.fromObject(input.data.soilmodel) : null;
            const boundaries = input.data.boundaries ? BoundaryCollection.fromObject(input.data.boundaries) : null;
            const transport = input.data.transport ? Transport.fromObject(input.data.transport) : null;
            const variableDensity = input.data.variableDensity ? VariableDensity.fromObject(input.data.variableDensity) : null;

            if (model && soilmodel && boundaries && transport && variableDensity) {
                if (packages instanceof FlopyPackages) {

                }

                if (packages === null) {

                }

                result = {
                    type: CALCULATE_PACKAGES_RESULT,
                    data: {}
                } as IWorkerResult<IFlopyPackages>;

                // @ts-ignore
                postMessage(result);
                break;
            }
    }
});
