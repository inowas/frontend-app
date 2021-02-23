import {GenericObject} from '../genericObject/GenericObject';
import IHealth from './Health.type';

class Health extends GenericObject<IHealth> {
  get pathogenId() {
    return this._props.pathogenId;
  }

  get pathogenName() {
    return this._props.pathogenName;
  }

  get infectionToIllness() {
    return this._props.infectionToIllness;
  }

  get dalysPerCase() {
    return this._props.dalysPerCase;
  }

  public static fromObject(obj: IHealth) {
    return new Health(obj);
  }

  public toPayload() {
    return {
      PathogenID: this.pathogenId,
      PathogenName: this.pathogenName,
      infection_to_illness: this.infectionToIllness,
      days_per_case: this.dalysPerCase
    };
  }
}

export default Health;
