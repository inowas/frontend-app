import {cloneDeep} from 'lodash';
import DoseResponse from './DoseResponse';
import Exposure from './Exposure';
import Health from './Health';
import IQmra from './Qmra.type';
import Pathogen from './Pathogen';
import TreatmentProcess from './TreatmentProcess';
import TreatmentScheme from './TreatmentScheme';

class Qmra {
  get exposure() {
    return this._props.exposure.map((e) => Exposure.fromObject(e));
  }

  get inflow() {
    return this._props.inflow.map((i) => Pathogen.fromObject(i));
  }

  get treatmentProcesses() {
    return this._props.treatment.processes.map((p) => TreatmentProcess.fromObject(p));
  }

  get treatmentSchemes() {
    return this._props.treatment.schemes.map((s) => TreatmentScheme.fromObject(s));
  }

  get doseResponse() {
    return this._props.doseResponse.map((r) => DoseResponse.fromObject(r));
  }

  get health() {
    return this._props.health.map((h) => Health.fromObject(h));
  }

  public static fromObject(obj: IQmra) {
    return new Qmra(obj);
  }

  protected _props: IQmra;

  constructor(obj: IQmra) {
    this._props = obj;
  }

  public toObject() {
    return cloneDeep(this._props);
  }

  public toPayload() {
    return {
      config: {
        exposure: this.exposure.map((e) => e.toPayload()),
        inflow: this.inflow.map((p) => p.toPayload()),
        treatment: {
          processes: this.treatmentProcesses.map((p) => p.toPayload()),
          schemes: this.treatmentSchemes.map((s) => s.toPayload())
        },
        doseresponse: this.doseResponse.map((r) => r.toPayload()),
        health: this.health.map((h) => h.toPayload())
      }
    };
  }
}

export default Qmra;
