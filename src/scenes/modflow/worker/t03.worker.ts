import {
  BoundaryCollection,
  BoundingBox,
  Geometry,
  GridSize,
  ModflowModel,
  Soilmodel,
  Transport,
  VariableDensity,
} from '../../../core/model/modflow';
import { IBoundary } from '../../../core/model/modflow/boundaries/Boundary.type';

import {
  ICalculateBoundaryImportInputData,
  ICalculateCellsInputData,
  ICalculateMfPackagesInputData,
  ICalculatePackagesInputData,
  IObservationInputData,
  IWorkerInput,
  IWorkerResult,
} from './t03.worker.type';
import { ICells } from '../../../core/model/geometry/Cells.type';
import { IFlopyPackages } from '../../../core/model/flopy/packages/FlopyPackages.type';
import { IStatistics } from '../../t03/components/content/observation/statistics';
import { calculateActiveCells } from '../../../services/geoTools';
import FlopyPackages from '../../../core/model/flopy/packages/FlopyPackages';
import calculateStatistics from '../../../services/statistics/calculateStatistics';

export const CALCULATE_STATISTICS_INPUT = 'CALCULATE_STATISTICS_INPUT';
export const CALCULATE_STATISTICS_RESULT = 'CALCULATE_STATISTICS_RESULT';

export const CALCULATE_CELLS_INPUT = 'CALCULATE_CELLS_INPUT';
export const CALCULATE_CELLS_RESULT = 'CALCULATE_CELLS_RESULT';

export const CALCULATE_PACKAGES_INPUT = 'CALCULATE_PACKAGES_INPUT';
export const CALCULATE_PACKAGES_RESULT = 'CALCULATE_PACKAGES_RESULT';

export const CALCULATE_MF_PACKAGES_INPUT = 'CALCULATE_MF_PACKAGES_INPUT';
export const CALCULATE_MF_PACKAGES_RESULT = 'CALCULATE_MF_PACKAGES_RESULT';

export const CALCULATE_BOUNDARIES_IMPORT_INPUT = 'CALCULATE_IMPORT_BOUNDARIES_INPUT';
export const CALCULATE_BOUNDARIES_IMPORT_RESULT = 'CALCULATE_BOUNDARIES_IMPORT_RESULT';

/* eslint-disable-next-line no-restricted-globals */
const ctx: Worker = self as any;

const calculateCells = (input: IWorkerInput<ICalculateCellsInputData>) => {
  const geometry = input.data.geometry ? Geometry.fromObject(input.data.geometry) : null;
  const boundingBox = input.data.boundingBox ? BoundingBox.fromObject(input.data.boundingBox) : null;
  const gridSize = input.data.gridSize ? GridSize.fromObject(input.data.gridSize) : null;
  const intersection = input.data.intersection || 0;

  if (geometry && boundingBox && gridSize) {
    return {
      type: CALCULATE_CELLS_RESULT,
      data: calculateActiveCells(geometry, boundingBox, gridSize, intersection).toObject(),
    } as IWorkerResult<ICells>;
  }

  return null;
};

const calculatePackages = (input: IWorkerInput<ICalculatePackagesInputData>) => {
  let packages = input.data.packages ? FlopyPackages.fromObject(input.data.packages) : null;
  const model = ModflowModel.fromObject(input.data.model);
  const soilmodel = Soilmodel.fromObject(input.data.soilmodel);
  const boundaries = BoundaryCollection.fromObject(input.data.boundaries);
  const transport = Transport.fromObject(input.data.transport);
  const variableDensity = VariableDensity.fromObject(input.data.variableDensity);

  if (packages instanceof FlopyPackages) {
    try {
      packages = packages.update(model, soilmodel, boundaries, transport, variableDensity);
    } catch (e) {
      packages = null;
    }
  }

  if (packages === null) {
    packages = FlopyPackages.createFromModelInstances(model, soilmodel, boundaries, transport, variableDensity);
  }

  return {
    type: CALCULATE_PACKAGES_RESULT,
    data: packages.toObject(),
  } as IWorkerResult<IFlopyPackages>;
};

const calculateMfPackages = (input: IWorkerInput<ICalculateMfPackagesInputData>) => {
  const pType = input.data.p;
  const packages = FlopyPackages.fromObject(input.data.packages);
  const model = ModflowModel.fromObject(input.data.model);
  const soilmodel = Soilmodel.fromObject(input.data.soilmodel);
  const boundaries = BoundaryCollection.fromObject(input.data.boundaries);

  packages.mf = packages.mf.recalculatePackages(pType, model, soilmodel, boundaries);

  return {
    type: CALCULATE_MF_PACKAGES_RESULT,
    data: packages.toObject(),
  } as IWorkerResult<IFlopyPackages>;
};

const calculateBoundaryImport = (input: IWorkerInput<ICalculateBoundaryImportInputData>) => {
  const boundingBox = BoundingBox.fromObject(input.data.boundingBox);
  const gridSize = GridSize.fromObject(input.data.gridSize);

  const bc = BoundaryCollection.fromExport(input.data.boundaries, boundingBox, gridSize);

  return {
    type: CALCULATE_BOUNDARIES_IMPORT_RESULT,
    data: bc.toObject(),
  } as IWorkerResult<IBoundary[]>;
};

// Respond to message from parent thread
ctx.addEventListener('message', (e) => {
  if (!e) {
    return;
  }

  const messageType = e.data.type;
  let input;
  let result;

  switch (messageType) {
    case CALCULATE_STATISTICS_INPUT:
      input = e.data as IWorkerInput<IObservationInputData>;
      result = {
        type: CALCULATE_STATISTICS_RESULT,
        data: calculateStatistics(input.data.data, input.data.exclude),
      } as IWorkerResult<IStatistics>;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      postMessage(result);
      break;

    case CALCULATE_CELLS_INPUT:
      input = e.data as IWorkerInput<ICalculateCellsInputData>;
      result = calculateCells(input);
      if (result) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        postMessage(result);
      }

      break;

    case CALCULATE_PACKAGES_INPUT:
      input = e.data as IWorkerInput<ICalculatePackagesInputData>;
      result = calculatePackages(input);
      if (result) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        postMessage(result);
      }
      break;

    case CALCULATE_MF_PACKAGES_INPUT:
      input = e.data as IWorkerInput<ICalculateMfPackagesInputData>;
      result = calculateMfPackages(input);
      if (result) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        postMessage(result);
      }
      break;

    case CALCULATE_BOUNDARIES_IMPORT_INPUT:
      input = e.data as IWorkerInput<ICalculateBoundaryImportInputData>;
      result = calculateBoundaryImport(input);
      if (result) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        postMessage(result);
      }
      break;
  }
});
