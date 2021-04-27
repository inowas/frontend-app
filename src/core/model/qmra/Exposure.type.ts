import {IPropertyValueObject} from '../types';

export default interface IExposure extends IPropertyValueObject {
  name: string;
  type: string;
  value?: number;
  min?: number;
  max?: number;
  mode?: number;
}
