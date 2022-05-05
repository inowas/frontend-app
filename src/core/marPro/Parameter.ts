import { GenericObject } from '../model/genericObject/GenericObject';
import { IParameter } from './Parameter.type';
import uuid from 'uuid';

class Parameter extends GenericObject<IParameter> {
  get id() {
    return this._props.id;
  }

  set id(value: string) {
    this._props.id = value;
  }

  get isFixed() {
    return this._props.isFixed;
  }

  get max() {
    return this._props.max;
  }

  get min() {
    return this._props.min;
  }

  get name() {
    return this._props.name;
  }

  get relations() {
    return this._props.relations;
  }

  get value() {
    return this._props.value;
  }

  get valuePropertyKey() {
    return this._props.valuePropertyKey;
  }

  public static fromDefaults() {
    return new Parameter({
      id: uuid.v4(),
      name: 'New Parameter',
      relations: [],
      value: 0,
    });
  }

  public static fromObject(value: IParameter) {
    return new Parameter(value);
  }
}

export default Parameter;
