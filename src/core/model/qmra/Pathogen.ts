import {cloneDeep} from 'lodash';
import IPathogen from './Pathogen.type';

class Pathogen {
  get id() {
    return this._props.id;
  }

  get name() {
    return this._props.name;
  }

  get group() {
    return this._props.group;
  }

  get simulate() {
    return this._props.simulate;
  }

  get type() {
    return this._props.type;
  }

  get min() {
    return this._props.min;
  }

  get max() {
    return this._props.max;
  }

  public static fromObject(obj: IPathogen) {
    return new Pathogen(obj);
  }

  protected _props: IPathogen;

  constructor(obj: IPathogen) {
    this._props = obj;
  }

  public toObject() {
    return cloneDeep(this._props);
  }

  public toPayload() {
    return {
      PathogenID: this.id,
      PathogenName: this.name,
      PathogenGroup: this.group,
      simulate: this.simulate,
      type: this.type,
      min: this.min,
      max: this.max
    };
  }
}

export default Pathogen;
