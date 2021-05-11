import {IPropertyValueObject} from '../types';

export interface IValue {
  type: string;
  min: number;
  max: number;
  mode: number;
  value: number;
}

export default interface IExposureScenario extends IPropertyValueObject {
  id?: string;
  description: string;
  eventsPerYear: IValue;
  isActive?: boolean;
  litresPerEvent: IValue;
  name: string;
  link: string;
  reference: string;
}
