export default interface IDoseResponse {
  id: string;
  pathogenId: number;
  pathogenName: string;
  pathogenGroup: string;
  bestFitModel: string;
  k?: number;
  alpha?: number;
  n50?: number;
  hostType: string;
  doseUnits: string;
  route: string;
  response: string;
  reference: string;
  link: string;
}

export interface IDoseResponsePayload {
  PathogenID: number;
  PathogenName: string;
  PathogenGroup: string;
  "Best fit model*": string;
  alpha?: number;
  k?: number;
  N50?: number;
  "Host type": string;
  "Dose units": string;
  Route: string;
  Response: string;
  Reference: string;
  Link: string;
}
