import { GeoJson } from '../geometry/Geometry.type';
import { IBoundingBox } from '../geometry/BoundingBox.type';
import { ICells } from '../geometry/Cells.type';
import { IGridSize } from '../geometry/GridSize.type';
import { ILengthUnit } from './LengthUnit.type';
import { IStressPeriods } from './Stressperiods.type';
import { ITimeUnit } from './TimeUnit.type';

export interface IDiscretization {
  geometry: GeoJson;
  bounding_box: IBoundingBox;
  grid_size: IGridSize;
  cells: ICells;
  intersection?: number;
  rotation?: number;
  stressperiods: IStressPeriods;
  length_unit: ILengthUnit;
  time_unit: ITimeUnit;
}

export interface IDiscretizationImport {
  geometry?: GeoJson;
  bounding_box?: IBoundingBox;
  grid_size?: IGridSize;
  stressperiods?: IStressPeriods;
  length_unit?: ILengthUnit;
  time_unit?: ITimeUnit;
}

export interface IModflowModel {
  id: string;
  is_scenario: boolean;
  name: string;
  description: string;
  permissions: string;
  public: boolean;
  discretization: IDiscretization;
  calculation_id: string;
}
