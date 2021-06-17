import {GenericObject} from '../genericObject/GenericObject';
import IExposureScenario from './ExposureScenario.type';
import uuid from 'uuid';

class ExposureScenario extends GenericObject<IExposureScenario> {
  get id() {
    return this._props.id;
  }

  set id(value) {
    this._props.id = value;
  }

  get name() {
    return this._props.name;
  }

  get description() {
    return this._props.description;
  }

  get litresPerEvent() {
    return this._props.litresPerEvent;
  }

  get eventsPerYear() {
    return this._props.eventsPerYear;
  }

  get isActive() {
    return this._props.isActive;
  }

  set isActive(value) {
    this._props.isActive = value;
  }

  get reference() {
    return this._props.reference;
  }

  get link() {
    return this._props.link;
  }

  public static fromCsv(obj2: {[key: string]: number | string}) {
    const obj1 = this.fromDefaults().toObject();

    for (const key of Object.keys(obj2)) {
      if (key in obj1) {
        obj1[key] = obj2[key];
      }
    }

    return new ExposureScenario(obj1);
  }

  public static fromDefaults() {
    return new ExposureScenario({
      id: uuid.v4(),
      name: 'New Exposure Scenario',
      description: '',
      litresPerEvent: {
        type: 'value', value: 1, min: 0, max: 1, mode: 1
      },
      eventsPerYear: {
        type: 'value', value: 365, min: 0, max: 1, mode: 1
      },
      isActive: false,
      reference: '',
      link: ''
    });
  }

  public static fromObject(obj: IExposureScenario) {
    return new ExposureScenario(obj);
  }
}

export default ExposureScenario;
