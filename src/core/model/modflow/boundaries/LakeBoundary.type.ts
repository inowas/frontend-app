import {ICells} from '../../geometry/Cells.type';
import {ISpValues} from './Boundary.type';
import {Polygon} from 'geojson';

export interface ILakeBoundary {
  id: string;
  type: 'Feature';
  geometry: Polygon;
  properties: {
    type: 'lak';
    name: string;
    cells: ICells;
    layers: number[];
    sp_values: ISpValues;
    lake_id: number;
  };
}

export interface ILakeBoundaryExport {
  type: 'lak';
  id?: string;
  name: string;
  geometry: Polygon;
  layers: number[];
  cells?: ICells;
  sp_values: ISpValues;
  lake_id: number;
}
