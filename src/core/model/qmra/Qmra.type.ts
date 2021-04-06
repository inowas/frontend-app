import {ISimpleTool} from '../types';
import {ITreatmentProcess} from './TreatmentProcess.type';
import IDoseResponse from './DoseResponse.type';
import IExposure from './Exposure.type';
import IHealth from './Health.type';
import IPathogen from './Pathogen.type';
import ITreatmentScheme from './TreatmentScheme.type';

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

export default IQmra;
