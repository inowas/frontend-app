import { Cells } from '../../../core/model/geometry';

export interface IDrawEvents {
  onCreated?: (e: any) => any;
  onEdited?: (e: any) => any;
}

export interface IMapWithControlsOptions {
  area?: {
    checked?: boolean;
  };
  boundaries?: {
    checked?: boolean;
    excluded: string[];
  };
  boundingBox?: {
    checked?: boolean;
  };
  events?: IDrawEvents;
  fullScreenControl?: boolean;
  grid?: {
    checked?: boolean;
  };
  inactiveCells?: {
    checked?: boolean;
    state?: Cells;
  };
  raster?: {
    colors?: string[];
    layer: number;
    globalMinMax?: [number, number];
    quantile: number;
  };
}
