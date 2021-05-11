import {ISimpleTool} from '../types';
import {ITreatmentProcess, ITreatmentProcessPayload} from './TreatmentProcess.type';
import IDoseResponse, {IDoseResponsePayload} from './DoseResponse.type';
import IExposure from './Exposure.type';
import IExposureScenario from './ExposureScenario.type';
import IHealth, {IHealthPayload} from './Health.type';
import IPathogen, {IPathogenPayload} from './Pathogen.type';
import ITreatmentScheme, {ITreatmentSchemePayload} from './TreatmentScheme.type';

interface IQmra extends ISimpleTool<IQmraData> {
  data: IQmraData;
}

interface IQmraData {
  exposureScenarios: IExposureScenario[];
  inflow: IPathogen[];
  treatment: {
    processes: ITreatmentProcess[];
    schemes: ITreatmentScheme[];
  };
  doseResponse: IDoseResponse[];
  health: IHealth[];
  numberOfRepeatings: number;
}

export interface IQmraRequest {
  config: {
    exposure: IExposure[];
    inflow: IPathogenPayload[];
    treatment: {
      processes: ITreatmentProcessPayload[];
      schemes: ITreatmentSchemePayload[];
    };
    doseresponse: IDoseResponsePayload[];
    health: IHealthPayload[];
  };
}

export default IQmra;
