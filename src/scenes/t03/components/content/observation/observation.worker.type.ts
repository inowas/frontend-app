import {IHobData, IStatistics} from './statistics';

export interface IObservationWorkerInput {
    type: string;
    data: IObservationInputData;
}

export interface IObservationWorkerResult {
    type: string;
    data: IObservationResultData;
}

export interface IObservationInputData {
    data: IHobData;
    exclude: string[];
}

export interface IObservationResultData {
    data: IStatistics | null;
}
