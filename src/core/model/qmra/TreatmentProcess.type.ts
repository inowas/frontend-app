export interface ITreatmentProcessGroup {
  processId: number;
  name: string;
  group: string;
}

export interface ITeatmentProcessElement {
  id: string;
  pathogenGroup: string;
  type: string;
  min: number;
  max: number;
  reference: string;
}

export type ITreatmentProcess = ITreatmentProcessGroup & ITeatmentProcessElement;

export interface ITreatmentProcessPayload {
  TreatmentID: number;
  TreatmentName: string;
  TreatmentGroup: string;
  PathogenGroup: string;
  type: string;
  min: number;
  max: number;
}
