import {GenericObject} from '../genericObject/GenericObject';
import ITreatmentProcess from './TreatmentProcess.type';

class TreatmentProcess extends GenericObject<ITreatmentProcess> {
  get id() {
    return this._props.id;
  }

  get name() {
    return this._props.name;
  }

  get group() {
    return this._props.group;
  }

  get pathogenGroup() {
    return this._props.pathogenGroup;
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

  public static fromObject(obj: ITreatmentProcess) {
    return new TreatmentProcess(obj);
  }

  public toPayload() {
    return {
      TreatmentID: this.id,
      TreatmentName: this.name,
      TreatmentGroup: this.group,
      PathogenGroup: this.pathogenGroup,
      type: this.type,
      min: this.min,
      max: this.max
    };
  }
}

export default TreatmentProcess;
