import {IExposureTriangle, IExposureValue} from './Exposure.type';
import IDoseResponse from './DoseResponse.type';
import IPathogen from './Pathogen.type';
import ITreatmentProcess from './TreatmentProcess.type';
import ITreatmentScheme from './TreatmentScheme.type';

interface IQmra {
  exposure: Array<IExposureValue | IExposureTriangle>;
  inflow: IPathogen[];
  treatment: {
    processes: ITreatmentProcess[];
    schemes: ITreatmentScheme[];
  };
  doseResponse: IDoseResponse[];
  health: any[];
}

export default IQmra;
