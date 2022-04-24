import { GenericObject } from '../model/genericObject/GenericObject';
import { IResourceSettings } from './Resource.type';
import uuid from 'uuid';

class ResourceSettings extends GenericObject<IResourceSettings> {
  get color() {
    return this._props.color;
  }

  get id() {
    return this._props.id;
  }

  set id(value: string) {
    this._props.id = value;
  }

  get icon() {
    return this._props.icon;
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

  get startValue() {
    return this._props.startValue;
  }

  get unit() {
    return this._props.unit;
  }

  public static fromDefaults() {
    return new ResourceSettings({
      id: uuid.v4(),
      name: 'New Resource',
      startValue: 0,
    });
  }

  public static fromObject(value: IResourceSettings) {
    return new ResourceSettings(value);
  }
}

export default ResourceSettings;
