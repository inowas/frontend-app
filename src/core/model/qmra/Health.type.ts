export default interface IHealth {
  id: string;
  pathogenId: number;
  pathogenName: string;
  infectionToIllness: number;
  dalysPerCase: number;
  reference1: string;
  reference2: string;
}

export interface IHealthPayload {
  PathogenID: number;
  PathogenName: string;
  'infection_to_illness'?: number;
  'dalys_per_case'?: number;
}
