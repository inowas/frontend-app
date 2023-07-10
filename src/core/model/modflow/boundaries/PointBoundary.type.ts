import { ICells } from '../../geometry/Cells.type';
import { ISpValues } from './Boundary.type';
import { Point } from 'geojson';

export interface IPointBoundary {
  id: string;
  type: 'Feature';
  geometry: Point;
  properties: IPointBoundaryProperties;
}

export interface IPointBoundaryProperties {
  name: string;
  cells: ICells;
  layers: number[];
  sp_values: ISpValues;
  isExcludedFromCalculation: boolean;
}

export interface IPointBoundaryExport {
  id?: string;
  name: string;
  geometry: Point;
  layers: number[];
  cells?: ICells;
  sp_values: ISpValues;
  is_excluded_from_calculation: boolean;
}
