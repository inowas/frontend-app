import {GenericObject} from '../genericObject/GenericObject';
import {includes} from 'lodash';
import DoseResponse from './DoseResponse';
import Exposure from './Exposure';
import Health from './Health';
import IQmra from './Qmra.type';
import Pathogen from './Pathogen';
import TreatmentProcess from './TreatmentProcess';
import TreatmentScheme from './TreatmentScheme';
import uuid from 'uuid';

class Qmra extends GenericObject<IQmra> {
  get exposure() {
    return this._props.data.exposure.map((e) => Exposure.fromObject(e));
  }

  get inflow() {
    return this._props.data.inflow.map((i) => Pathogen.fromObject(i));
  }

  get treatmentProcesses() {
    return this._props.data.treatment.processes.map((p) => TreatmentProcess.fromObject(p));
  }

  get treatmentSchemes() {
    return this._props.data.treatment.schemes.map((s) => TreatmentScheme.fromObject(s));
  }

  get doseResponse() {
    return this._props.data.doseResponse.map((r) => DoseResponse.fromObject(r));
  }

  get health() {
    return this._props.data.health.map((h) => Health.fromObject(h));
  }

  get id(): string {
    return this._props.id;
  }

  set id(value: string) {
    this._props.id = value;
  }

  get name(): string {
    return this._props.name;
  }

  set name(value: string) {
    this._props.name = value;
  }

  get description(): string {
    return this._props.description;
  }

  set description(value: string) {
    this._props.description = value;
  }

  get permissions(): string {
    return this._props.permissions;
  }

  set permissions(value: string) {
    this._props.permissions = value;
  }

  get public(): boolean {
    return this._props.public;
  }

  set public(value: boolean) {
    this._props.public = value;
  }

  get tool(): string {
    return this._props.tool;
  }

  get readOnly() {
    return !includes(this.permissions, 'w');
  }

  public static fromDefaults() {
    return new Qmra({
      id: uuid.v4(),
      name: 'New quantitative microbial risk assessment',
      data: {
        exposure: [],
        inflow: [],
        treatment: {
          processes: [],
          schemes: []
        },
        doseResponse: [],
        health: []
      },
      description: '',
      permissions: 'rwx',
      public: true,
      tool: 'T15'
    });
  }

  public static fromObject(obj: IQmra) {
    return new Qmra(obj);
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
