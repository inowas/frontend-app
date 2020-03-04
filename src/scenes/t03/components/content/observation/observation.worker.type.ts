import {IHobData, IStatistics} from './statistics';

export interface IObservationWorkerInput {
    type: string;
    data: IObservationInputData;
}

export interface IObservationWorkerResult {
    type: string;
    data: IStatistics | null;
}

export interface IObservationInputData {
    data: IHobData;
    exclude: string[];
}
