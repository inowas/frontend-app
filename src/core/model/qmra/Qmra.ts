import {GenericObject} from '../genericObject/GenericObject';
import {IValue} from './ExposureScenario.type';
import {includes} from 'lodash';
import DoseResponse from './DoseResponse';
import ExposureScenario from './ExposureScenario';
import Health from './Health';
import IExposure from './Exposure.type';
import IQmra, {IQmraRequest} from './Qmra.type';
import Pathogen from './Pathogen';
import TreatmentProcess from './TreatmentProcess';
import TreatmentScheme from './TreatmentScheme';
import uuid from 'uuid';

class Qmra extends GenericObject<IQmra> {
  get exposureScenarios() {
    return this._props.data.exposureScenarios.map((e) => ExposureScenario.fromObject(e));
  }

  set exposureScenarios(value: ExposureScenario[]) {
    this._props.data.exposureScenarios = value.map((e) => e.toObject());
  }

  get inflow() {
    return this._props.data.inflow.map((i) => Pathogen.fromObject(i));
  }

  set inflow(value: Pathogen[]) {
    this._props.data.inflow = value.map((i) => i.toObject());
  }

  get treatmentProcesses() {
    return this._props.data.treatment.processes.map((p) => TreatmentProcess.fromObject(p));
  }

  set treatmentProcesses(value: TreatmentProcess[]) {
    this._props.data.treatment.processes = value.map((tp) => tp.toObject());
  }

  get treatmentSchemes() {
    return this._props.data.treatment.schemes.map((s) => TreatmentScheme.fromObject(s));
  }

  set treatmentSchemes(value: TreatmentScheme[]) {
    this._props.data.treatment.schemes = value.map((ts) => ts.toObject());
  }

  get doseResponse() {
    return this._props.data.doseResponse.map((r) => DoseResponse.fromObject(r));
  }

  set doseResponse(value: DoseResponse[]) {
    this._props.data.doseResponse = value.map((dr) => dr.toObject());
  }

  get health() {
    return this._props.data.health.map((h) => Health.fromObject(h));
  }

  set health(value: Health[]) {
    this._props.data.health = value.map((h) => h.toObject());
  }

  get numberOfRepeatings() {
    return this._props.data.numberOfRepeatings;
  }

  set numberOfRepeatings(value: number) {
    this._props.data.numberOfRepeatings = value;
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

  public addElement(element: ExposureScenario | Pathogen | TreatmentProcess | TreatmentScheme | DoseResponse | Health) {
    if (element instanceof ExposureScenario) {
      this._props.data.exposureScenarios.push(element.toObject())
    }
    if (element instanceof Pathogen) {
      this._props.data.inflow.push(element.toObject())
      this._props.data.health.push(Health.fromPathogen(element).toObject());
    }
    if (element instanceof TreatmentProcess) {
      this._props.data.treatment.processes.push(element.toObject())
    }
    if (element instanceof TreatmentScheme) {
      this._props.data.treatment.schemes.push(element.toObject())
    }
    if (element instanceof DoseResponse) {
      this._props.data.doseResponse.push(element.toObject())
    }
    if (element instanceof Health) {
      this._props.data.health.push(element.toObject())
    }
    return this;
  }

  public updateElement(element: ExposureScenario | Pathogen | TreatmentProcess | TreatmentScheme | DoseResponse | Health) {
    if (element instanceof ExposureScenario) {
      this._props.data.exposureScenarios = this._props.data.exposureScenarios.map((e) => e.id === element.id ? element.toObject() : e);
    }
    if (element instanceof Pathogen) {
      this._props.data.inflow = this._props.data.inflow.map((e) => e.id === element.id ? element.toObject() : e);
      this._props.data.health = this._props.data.health.map((e) => {
        if (e.pathogenId === element.id) {
          e.pathogenName = element.name;
        }
        return e;
      });
    }
    if (element instanceof TreatmentProcess) {
      this._props.data.treatment.processes = this._props.data.treatment.processes.map((tp) => {
        if (tp.processId === element.processId) {
          tp.name = element.name;
          tp.group = element.group;
        }
        return tp;
      });
      this._props.data.treatment.schemes = this._props.data.treatment.schemes.map((ts) => {
        if (ts.treatmentId === element.processId) {
          ts.treatmentName = element.name;
        }
        return ts;
      });
    }
    if (element instanceof TreatmentScheme) {
      this._props.data.treatment.schemes = this._props.data.treatment.schemes.map((ts) => {
        if (ts.schemeId === element.schemeId) {
          ts.name = element.name;
        }
        return ts;
      });
    }
    if (element instanceof DoseResponse) {
      console.log(element.id, this._props.data.doseResponse);
      this._props.data.doseResponse = this._props.data.doseResponse.map((e) => e.id === element.id ? element.toObject() : e);
    }
    if (element instanceof Health) {
      this._props.data.health = this._props.data.health.map((e) => e.id === element.id ? element.toObject() : e);
    }
    return this;
  }

  public removeElement(element: ExposureScenario | Pathogen | TreatmentProcess | TreatmentScheme | DoseResponse | Health) {
    if (element instanceof ExposureScenario) {
      this._props.data.exposureScenarios = this._props.data.exposureScenarios.filter((e) => e.id !== element.id);
    }
    if (element instanceof Pathogen) {
      this._props.data.inflow = this._props.data.inflow.filter((e) => e.id !== element.id);
      this._props.data.doseResponse = this._props.data.doseResponse.filter((e) => e.pathogenId !== element.id);
      this._props.data.health = this._props.data.health.filter((e) => e.pathogenId !== element.id);
    }
    if (element instanceof TreatmentProcess) {
      this._props.data.treatment.processes = this._props.data.treatment.processes.filter((e) => e.id !== element.id);
      if (this.treatmentProcesses.filter((tp) => tp.processId === element.processId).length === 0) {
        this._props.data.treatment.schemes = this._props.data.treatment.schemes.filter((ts) => ts.treatmentId !== element.processId);
      }
    }
    if (element instanceof TreatmentScheme) {
      this._props.data.treatment.schemes = this._props.data.treatment.schemes.filter((e) => e.id !== element.id);
    }
    if (element instanceof DoseResponse) {
      this._props.data.doseResponse = this._props.data.doseResponse.filter((e) => e.id !== element.id);
    }
    if (element instanceof Health) {
      this._props.data.health = this._props.data.health.filter((e) => e.id !== element.id);
    }
    return this;
  }

  public static fromDefaults() {
    return new Qmra({
      id: uuid.v4(),
      name: 'New quantitative microbial risk assessment',
      data: {
        exposureScenarios: [],
        inflow: [],
        treatment: {
          processes: [],
          schemes: []
        },
        doseResponse: [],
        health: [],
        numberOfRepeatings: 100
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

  public fromPayload(obj: IQmraRequest) {
    const eventsPerYear = obj.config.exposure.filter((e) => e.name === 'number_of_exposures');
    const litresPerEvent = obj.config.exposure.filter((e) => e.name === 'volume_perEvent');
    const numberOfRepeatings = obj.config.exposure.filter((e) => e.name === 'number_of_repeatings')

    let litresPerEventValue: IValue = {type: 'value', min: 0, max: 1, mode: 1, value: 365};

    if (litresPerEvent.length > 0) {
      if (litresPerEvent[0].mode && litresPerEvent[0].min && litresPerEvent[0].max) {
        litresPerEventValue =
          {
            type: 'triangle',
            value: 0,
            min: litresPerEvent[0].min,
            max: litresPerEvent[0].max,
            mode: litresPerEvent[0].mode
          };
      }
      if (litresPerEvent[0].value) {
        litresPerEventValue = {type: 'value', min: 0, max: 1, mode: 1, value: litresPerEvent[0].value};
      }
    }

    this.numberOfRepeatings = numberOfRepeatings.length > 0 && numberOfRepeatings[0].value ?
      numberOfRepeatings[0].value : 100;
    this.exposureScenarios = [
      ExposureScenario.fromObject({
        id: uuid.v4(),
        isActive: true,
        name: 'Exposure Scenario',
        description: '',
        link: '',
        reference: '',
        eventsPerYear: eventsPerYear.length > 0 && eventsPerYear[0].value ?
          {type: 'value', min: 0, max: 1, mode: 1, value: eventsPerYear[0].value} :
          {type: 'value', min: 0, max: 1, mode: 1, value: 365},
        litresPerEvent: litresPerEventValue
      })
    ];
    this.inflow = obj.config.inflow.map((p) => Pathogen.fromPayload(p));
    this.treatmentProcesses = obj.config.treatment.processes.map((tp) => TreatmentProcess.fromPayload(tp));
    this.treatmentSchemes = obj.config.treatment.schemes.map((ts) => TreatmentScheme.fromPayload(ts));
    this.health = obj.config.health.map((h) => Health.fromPayload(h));
    this.doseResponse = obj.config.doseresponse.map((dr) => DoseResponse.fromPayload(dr));
    return this;
  }

  public toPayload() {
    return {
      config: {
        exposure: this.generateExposure(),
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

  private generateExposure(): IExposure[] {
    const activeScenarios = this.exposureScenarios.filter((e) => e.isActive);
    if (activeScenarios.length > 0) {
      const activeScenario = activeScenarios[0];

      return [
        {name: 'volume_perEvent', ...activeScenario.litresPerEvent},
        {name: 'number_of_exposures', ...activeScenario.eventsPerYear},
        {name: 'number_of_repeatings', type: 'value', value: this.numberOfRepeatings}
      ];
    }
    return [
      {name: 'volume_perEvent', type: 'value', value: 100},
      {name: 'number_of_exposures', type: 'value', value: 365},
      {name: 'number_of_repeatings', type: 'value', value: this.numberOfRepeatings}
    ];
  }
}

export default Qmra;
