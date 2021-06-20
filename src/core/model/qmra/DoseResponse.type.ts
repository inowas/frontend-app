export default interface IDoseResponse {
  id: string;
  pathogenId: number;
  pathogenName: string;
  pathogenGroup: string;
  bestFitModel: string;
  k: number | null;
  alpha: number | null;
  n50: number | null;
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
  'Best fit model*': string;
  alpha?: number | null;
  k?: number | null;
  N50?: number | null;
  'Host type': string;
  'Dose units': string;
  Route: string;
  Response: string;
  Reference: string;
  Link: string;
}
