import {ISimpleTool} from '../types';
import {ITreatmentProcess, ITreatmentProcessPayload} from './TreatmentProcess.type';
import IDoseResponse, { IDoseResponsePayload } from './DoseResponse.type';
import IExposure, { IExposurePayload } from './Exposure.type';
import IHealth, { IHealthPayload } from './Health.type';
import IPathogen, { IPathogenPayload } from './Pathogen.type';
import ITreatmentScheme, { ITreatmentSchemePayload } from './TreatmentScheme.type';

interface IQmra extends ISimpleTool<IQmraData> {
  data: IQmraData;
}

interface IQmraData {
  exposure: Array<IExposure>;
  inflow: IPathogen[];
  treatment: {
    processes: ITreatmentProcess[];
    schemes: ITreatmentScheme[];
  };
  doseResponse: IDoseResponse[];
  health: IHealth[];
}

export interface IQmraRequest {
    exposure: IExposurePayload[];
    inflow: IPathogenPayload[];
    treatment: {
      processes: ITreatmentProcessPayload[];
      schemes: ITreatmentSchemePayload[];
    },
    doseresponse: IDoseResponsePayload[];
    health: IHealthPayload[];
}

export default IQmra;
