import {GenericObject} from '../genericObject/GenericObject';
import {ITreatmentProcess} from './TreatmentProcess.type';
import uuid from 'uuid';

class TreatmentProcess extends GenericObject<ITreatmentProcess> {
  get id() {
    return this._props.id;
  }

  get processId() {
    return this._props.processId;
  }

  set processId(value: number) {
    this._props.processId = value;
  }

  get name() {
    return this._props.name;
  }

  set name(value: string) {
    this._props.name = value;
  }

  get group() {
    return this._props.group;
  }

  set group(value: string) {
    this._props.group = value;
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

  public static fromPathogenGroup(pathogenGroup: string) {
    return new TreatmentProcess({
      id: uuid.v4(),
      processId: 0,
      name: 'New Process',
      group: 'New Treatment Group',
      pathogenGroup,
      type: 'uniform',
      min: 0,
      max: 2
    });
  }

  public static fromObject(obj: ITreatmentProcess) {
    return new TreatmentProcess(obj);
  }

  public toPayload() {
    return {
      TreatmentID: this.processId,
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
