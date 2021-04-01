import { GenericObject } from '../genericObject/GenericObject';
import IHealth from './Health.type';
import uuid from 'uuid';
import Pathogen from './Pathogen';

class Health extends GenericObject<IHealth> {
  get id() {
    return this._props.id;
  }

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

  get reference1() {
    return this._props.reference1;
  }

  get reference2() {
    return this._props.reference2;
  }

  public static fromPathogen(pathogen: Pathogen) {
    return new Health({
      id: uuid.v4(),
      pathogenId: pathogen.id,
      pathogenName: pathogen.name,
      reference1: '',
      reference2: ''
    });
  }

  public static fromObject(obj: IHealth) {
    return new Health(obj);
  }

  public toPayload() {
    return {
      PathogenID: this.pathogenId,
      PathogenName: this.pathogenName,
      infection_to_illness: this.infectionToIllness,
      days_per_case: this.dalysPerCase,
    };
  }
}

export default Health;
