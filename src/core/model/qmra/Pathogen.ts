import {GenericObject} from '../genericObject/GenericObject';
import IPathogen from './Pathogen.type';

class Pathogen extends GenericObject<IPathogen> {
  get id() {
    return this._props.id;
  }

  set id(value: number) {
    this._props.id = value;
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

  public static fromDefaults() {
    return new Pathogen({
      id: 0,
      name: 'New Pathogen',
      group: 'Bacteria',
      simulate: 0,
      type: 'log10_norm',
      min: 10,
      max: 10000
    });
  }

  public static fromObject(obj: IPathogen) {
    return new Pathogen(obj);
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
