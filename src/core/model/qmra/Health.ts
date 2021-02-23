import {cloneDeep} from 'lodash';
import IHealth from './Health.type';

class Health {
  get pathogenId() {
    return this._props.pathogenId;
  }

  get pathogenName() {
    return this._props.pathogenName;
  }

  get infectionToIllness() {
    return this._props.infectionToIllness;
  }

  get daysPerCase() {
    return this._props.daysPerCase;
  }

  public static fromObject(obj: IHealth) {
    return new Health(obj);
  }

  protected _props: IHealth;

  constructor(obj: IHealth) {
    this._props = obj;
  }

  public toObject() {
    return cloneDeep(this._props);
  }

  public toPayload() {
    return {
      PathogenID: this.pathogenId,
      PathogenName: this.pathogenName,
      infection_to_illness: this.infectionToIllness,
      days_per_case: this.daysPerCase
    };
  }
}

export default Health;
