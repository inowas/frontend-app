import { GenericObject } from '../../../genericObject/GenericObject';
import { IPropertyValueObject } from '../../../types';

export default class FlopyMt3dPackage<T> extends GenericObject<T> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static fromObject(obj: IPropertyValueObject) {
    throw new Error('Static Method fromObject not implemented in ' + this.constructor.name);
  }
}
