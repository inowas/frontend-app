import {IBoundary, IBoundaryExport} from '../../../core/model/modflow/boundaries/Boundary.type';
import {IBoundingBox} from '../../../core/model/geometry/BoundingBox.type';
import {IFlopyPackages} from '../../../core/model/flopy/packages/FlopyPackages.type';
import {IGeometry} from '../../../core/model/geometry/Geometry.type';
import {IGridSize} from '../../../core/model/geometry/GridSize.type';
import {IHobData} from '../../t03/components/content/observation/statistics';
import {IModflowModel} from '../../../core/model/modflow/ModflowModel.type';
import {ISoilmodel} from '../../../core/model/modflow/soilmodel/Soilmodel.type';
import {ITransport} from '../../../core/model/modflow/transport/Transport.type';
import {IVariableDensity} from '../../../core/model/modflow/variableDensity/VariableDensity.type';

export interface IWorkerInput<T> {
    type: string;
    data: T;
}

export interface IWorkerResult<T> {
    type: string;
    data: T | null;
}

export interface IObservationInputData {
    data: IHobData;
    exclude: string[];
}

export interface ICalculateCellsInputData {
    geometry: IGeometry;
    boundingBox: IBoundingBox;
    gridSize: IGridSize;
    intersection?: number;
}

export interface ICalculateBoundaryImportInputData {
    boundingBox: IBoundingBox;
    gridSize: IGridSize;
    boundaries: IBoundaryExport[];
}

export interface ICalculatePackagesInputData {
    packages: IFlopyPackages | null;
    model: IModflowModel;
    soilmodel: ISoilmodel;
    boundaries: IBoundary[];
    transport: ITransport;
    variableDensity: IVariableDensity;
}

export interface ICalculateMfPackagesInputData {
    p: string | string[] | null;
    packages: IFlopyPackages;
    model: IModflowModel;
    soilmodel: ISoilmodel;
    boundaries: IBoundary[];
}
