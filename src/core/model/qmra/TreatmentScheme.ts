import {GenericObject} from '../genericObject/GenericObject';
import ITreatmentScheme, { ITreatmentSchemePayload } from './TreatmentScheme.type';
import TreatmentProcess from './TreatmentProcess';
import uuid from 'uuid';

class TreatmentScheme extends GenericObject<ITreatmentScheme> {
  get id() {
    return this._props.id;
  }

  set id(value: string) {
    this._props.id = value;
  }

  get schemeId() {
    return this._props.schemeId;
  }

  set schemeId(value: number) {
    this._props.schemeId = value;
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
      id: uuid.v4(),
      schemeId: 0,
      name: 'New Treatment Scheme',
      treatmentId: p.processId,
      treatmentName: p.name
    });
  }

  public static fromObject(obj: ITreatmentScheme) {
    return new TreatmentScheme(obj);
  }

  public static fromPayload(obj: ITreatmentSchemePayload) {
    return new TreatmentScheme({
      id: uuid.v4(),
      schemeId: obj.TreatmentSchemeID,
      name: obj.TreatmentSchemeName,
      treatmentId: obj.TreatmentID,
      treatmentName: obj.TreatmentName
    });
  }

  public toPayload() {
    return {
      TreatmentSchemeID: this.schemeId,
      TreatmentSchemeName: this.name,
      TreatmentID: this.treatmentId,
      TreatmentName: this.treatmentName
    };
  }
}

export default TreatmentScheme;
