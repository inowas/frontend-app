import {IExposureTriangle, IExposureValue} from './Exposure.type';
import {ISimpleTool} from '../types';
import IDoseResponse from './DoseResponse.type';
import IHealth from './Health.type';
import IPathogen from './Pathogen.type';
import ITreatmentProcess from './TreatmentProcess.type';
import ITreatmentScheme from './TreatmentScheme.type';

interface IQmra extends ISimpleTool<IQmraData> {
  data: IQmraData;
}

interface IQmraData {
  exposure: Array<IExposureValue | IExposureTriangle>;
  inflow: IPathogen[];
  treatment: {
    processes: ITreatmentProcess[];
    schemes: ITreatmentScheme[];
  };
  doseResponse: IDoseResponse[];
  health: IHealth[];
}

export default IQmra;
