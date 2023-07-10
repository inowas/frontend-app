import { ICells } from '../../geometry/Cells.type';
import { ISpValues } from './Boundary.type';
import { Polygon } from 'geojson';

export type INevtop = number;

export interface IEvapotranspirationBoundary {
  id: string;
  type: 'Feature';
  geometry: Polygon;
  properties: {
    type: 'evt';
    name: string;
    cells: ICells;
    layers: number[];
    nevtop: INevtop;
    sp_values: ISpValues;
    isExcludedFromCalculation: boolean;
  };
}

export interface IEvapotranspirationBoundaryExport {
  type: 'evt';
  id?: string;
  name: string;
  geometry: Polygon;
  cells: ICells;
  layers: number[];
  nevtop: INevtop;
  sp_values: ISpValues;
  is_excluded_from_calculation: boolean;
}
