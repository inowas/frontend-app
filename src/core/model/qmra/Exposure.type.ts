interface IExposure {
  name: string;
  type: string;
}

export interface IExposureValue extends IExposure {
  value: number;
}

export interface IExposureTriangle extends IExposure {
  min: number;
  max: number;
  mode: number;
  mean: number;
}

export type TExposure = IExposureValue | IExposureTriangle;
