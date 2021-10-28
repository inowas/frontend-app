export interface IDrawEvents {
  onCreated?: (e: any) => any;
  onEdited?: (e: any) => any;
}

export interface IMapWithControlsOptions {
  area?: {
    checked?: boolean;
    enabled: boolean;
  };
  boundaries?: {
    checked?: boolean;
    enabled: boolean;
    excluded: string[];
  };
  boundingBox?: {
    checked?: boolean;
    enabled: boolean;
  };
  events?: {
    onCreated: (e: any) => any;
    onEdited: (e: any) => any;
  };
  fullScreenControl?: boolean;
  grid?: {
    checked?: boolean;
    enabled: boolean;
  };
  inactiveCells?: {
    checked?: boolean;
    enabled: boolean;
  };
  raster?: {
    colors?: string[];
    enabled: boolean;
    layer: number;
    globalMinMax?: [number, number];
    quantile: number;
  };
}
