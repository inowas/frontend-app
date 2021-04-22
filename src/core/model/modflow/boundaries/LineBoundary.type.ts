import { IBoundaryFeature } from './Boundary.type';
import { ICells } from '../../geometry/Cells.type';
import { IObservationPoint, IObservationPointExport } from './ObservationPoint.type';
import { LineString } from 'geojson';

export type LineBoundaryType = 'chd' | 'fhb' | 'ghb' | 'riv' | 'drn' | 'hfb' | 'str';

export interface ILineBoundaryFeatureCollection {
  type: 'FeatureCollection';
  features: Array<IBoundaryFeature | IObservationPoint>;
}

export interface ILineBoundaryFeature {
  type: 'Feature';
  id: string;
  geometry: LineString;
  properties: ILineBoundaryFeatureProperties;
}

export interface ILineBoundaryFeatureProperties {
  name: string;
  layers: number[];
  cells: ICells;
  isExcludedFromCalculation?: boolean;
}

export interface ILineBoundaryExport {
  id?: string;
  name: string;
  geometry: LineString;
  layers: number[];
  cells?: ICells;
  ops: IObservationPointExport[];
}
