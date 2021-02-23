import {TExposure} from './Exposure.type';
import {cloneDeep} from 'lodash';

class Exposure {
  get name() {
    return this._props.name;
  }

  get type() {
    return this._props.type;
  }

  get value() {
    return 'value' in this._props ? this._props.value : null;
  }

  get min() {
    return 'min' in this._props ? this._props.min : null;
  }

  get max() {
    return 'max' in this._props ? this._props.max : null;
  }

  get mode() {
    return 'mode' in this._props ? this._props.mode : null;
  }

  get mean() {
    return 'mean' in this._props ? this._props.mean : null;
  }

  public static fromObject(obj: TExposure) {
    return new Exposure(obj);
  }

  protected _props: TExposure;

  constructor(obj: TExposure) {
    this._props = obj;
  }

  public toObject() {
    return cloneDeep(this._props);
  }

  public toPayload() {
    if (this.min && this.max && this.mode && this.mean) {
      return {
        name: this.name,
        type: this.type,
        min: this.min,
        max: this.max,
        mode: this.mode,
        mean: this.mean
      };
    }
    return {
      name: this.name,
      type: this.type,
      value: this.value
    }
  }
}

export default Exposure;
