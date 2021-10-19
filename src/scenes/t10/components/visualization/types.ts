import { ISensor, ISensorParameter } from '../../../../core/model/rtm/monitoring/Sensor.type';

export interface IParameterWithMetaData {
  meta: {
    active: boolean;
    axis: 'left' | 'right';
    color: string;
    strokeDasharray?: string;
  };
  parameter: ISensorParameter;
  sensor: ISensor;
}

export interface ITimeStamps {
  minT: number;
  maxT: number;
  left: {
    min: number;
    max: number;
  };
  right: {
    min: number;
    max: number;
  };
  timestamps: number[];
}

export interface ILegendRowProps {
  color: string;
  label: string;
  unit: string;
}
