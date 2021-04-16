import {GenericObject} from '../genericObject/GenericObject';
import IExposure, { IExposurePayload } from './Exposure.type';
import uuid from 'uuid';

class Exposure extends GenericObject<IExposure> {
  get id() {
    return this._props.id;
  }

  get name() {
    return this._props.name;
  }

  get type() {
    return this._props.type;
  }

  get value() {
    return this._props.value;
  }

  get min() {
    return this._props.min;
  }

  get max() {
    return this._props.max;
  }

  get mode() {
    return this._props.mode;
  }

  get mean() {
    return this._props.mean;
  }

  public static fromCsv(obj2: {[key: string]: number | string}) {
    const obj1 = this.fromDefaults().toObject();

    for (const key of Object.keys(obj2)) {
      if (key in obj1) {
        obj1[key] = obj2[key];
      }
    }

    return new Exposure(obj1);
  }

  public static fromDefaults() {
    return new Exposure({
      id: uuid.v4(),
      name: 'New Exposure',
      type: 'value',
      value: 0,
      min: 0,
      max: 0,
      mode: 0,
      mean: 0
    });
  }

  public static fromObject(obj: IExposure) {
    return new Exposure(obj);
  }

  public static fromPayload(obj: IExposurePayload) {
    return new Exposure({
      id: uuid.v4(),
      value: obj.value || 0,
      min: obj.min || 0,
      max: obj.max || 0,
      mode: obj.mode || 0,
      mean: obj.mean || 0,
      ...obj
    });
  }

  public toPayload() {
    if (this.type === 'triangle') {
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
