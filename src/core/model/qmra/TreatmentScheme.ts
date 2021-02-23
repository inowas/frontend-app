import {cloneDeep} from 'lodash';
import ITreatmentScheme from './TreatmentScheme.type';

class TreatmentScheme {
  get id() {
    return this._props.id;
  }

  get name() {
    return this._props.name;
  }

  get treatmentId() {
    return this._props.treatmentId;
  }

  get treatmentName() {
    return this._props.treatmentName;
  }

  public static fromObject(obj: ITreatmentScheme) {
    return new TreatmentScheme(obj);
  }

  protected _props: ITreatmentScheme;

  constructor(obj: ITreatmentScheme) {
    this._props = obj;
  }

  public toObject() {
    return cloneDeep(this._props);
  }

  public toPayload() {
    return {
      TreatmentSchemeID: this.id,
      TreatmentSchemeName: this.name,
      TreatmentID: this.treatmentId,
      TreatmentName: this.treatmentName
    };
  }
}

export default TreatmentScheme;
