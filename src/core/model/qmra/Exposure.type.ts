import { IPropertyValueObject } from "../types";

export default interface IExposure extends IPropertyValueObject {
  id: string;
  name: string;
  type: string;
  value: number;
  min: number;
  max: number;
  mode: number;
  mean: number;
}
