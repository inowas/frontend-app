import {IFlopyPackages} from '../../../core/model/flopy/packages/FlopyPackages.type';
import {IBoundingBox} from '../../../core/model/geometry/BoundingBox.type';
import {IGeometry} from '../../../core/model/geometry/Geometry.type';
import {IGridSize} from '../../../core/model/geometry/GridSize.type';
import {IBoundary} from '../../../core/model/modflow/boundaries/Boundary.type';
import {IModflowModel} from '../../../core/model/modflow/ModflowModel.type';
import {ISoilmodel} from '../../../core/model/modflow/soilmodel/Soilmodel.type';
import {ITransport} from '../../../core/model/modflow/transport/Transport.type';
import {IVariableDensity} from '../../../core/model/modflow/variableDensity/VariableDensity.type';
import {IHobData} from '../components/content/observation/statistics';

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

export interface ICalculatePackagesInputData {
    packages: IFlopyPackages | null;
    model: IModflowModel;
    soilmodel: ISoilmodel;
    boundaries: IBoundary[];
    transport: ITransport;
    variableDensity: IVariableDensity;
}
