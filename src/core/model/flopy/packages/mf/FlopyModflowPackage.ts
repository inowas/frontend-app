import {GenericObject} from '../../../genericObject/GenericObject';
import {IPropertyValueObject} from '../../../types';

export default class FlopyModflowPackage<T> extends GenericObject<T> {
    public static fromObject(obj: IPropertyValueObject) {
        throw new Error('Static Method fromObject not implemented in ' + this.constructor.name);
    }
}
