import { BoundingBox, Cells } from '../../../core/model/geometry';

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
    data?: BoundingBox;
  };
  events?: IDrawEvents;
  fullScreenControl?: boolean;
  grid?: {
    checked?: boolean;
    data?: Cells;
  };
  inactiveCells?: {
    checked?: boolean;
    data?: Cells;
  };
  raster?: {
    colors?: string[];
    layer: number;
    globalMinMax?: [number, number];
    quantile: number;
  };
}
