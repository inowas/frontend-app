import {GenericObject} from '../genericObject/GenericObject';
import ITreatmentScheme from './TreatmentScheme.type';
import TreatmentProcess from './TreatmentProcess';

class TreatmentScheme extends GenericObject<ITreatmentScheme> {
  get id() {
    return this._props.id;
  }

  set id(value: number) {
    this._props.id = value;
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

  public static fromProcess(p: TreatmentProcess) {
    return new TreatmentScheme({
      id: 0,
      name: 'New Treatment Scheme',
      treatmentId: p.processId,
      treatmentName: p.name
    });
  }

  public static fromObject(obj: ITreatmentScheme) {
    return new TreatmentScheme(obj);
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
